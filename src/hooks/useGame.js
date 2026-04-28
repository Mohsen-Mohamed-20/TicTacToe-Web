import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { boardWinner, defaultPlayerNames, opponent } from '../utils/gameLogic';
import { getTranslations } from '../utils/i18n';
import { chooseAiMove, createEmptyAiResult, previewAiMoves } from '../utils/minimax';
import { saveSettings } from '../utils/storage';

const AI_DELAY_MS = 650;
const DEMO_DELAY_MS = 760;

function isAiTurn(mode, current, gameOver) {
  if (gameOver) return false;
  if (mode === 'human_ai') return current === 'O';
  return mode === 'ai_ai' || mode === 'minimax_random';
}

function aiStyle(mode, current) {
  return mode === 'minimax_random' && current === 'O' ? 'random' : 'minimax';
}

function buildPreview(board, mode, current, difficulty, gameOver, previewDepthLimit) {
  if (!isAiTurn(mode, current, gameOver)) {
    return { scores: {}, evaluatedOrder: [] };
  }

  return previewAiMoves(board, current, difficulty, aiStyle(mode, current), previewDepthLimit);
}

export function useGame({ mode, difficulty, initialNames, initialScores, sound, language = 'en', enabled = true, previewDepthLimit = 9 }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [scores, setScores] = useState(initialScores);
  const [playerNames, setPlayerNames] = useState(initialNames ?? defaultPlayerNames(mode, difficulty, language));
  const [aiWaiting, setAiWaiting] = useState(false);
  const [aiStats, setAiStats] = useState(createEmptyAiResult);
  const [preview, setPreview] = useState({ scores: {}, evaluatedOrder: [] });
  const [lastAiMove, setLastAiMove] = useState(null);
  const aiTimer = useRef(null);

  const gameOver = Boolean(winner);
  const activeAi = enabled && isAiTurn(mode, current, gameOver);

  const resetRound = useCallback(
    ({ resetScores = false } = {}) => {
      const nextScores = resetScores ? { X: 0, O: 0, Draw: 0 } : scores;
      setBoard(Array(9).fill(null));
      setCurrent('X');
      setWinner(null);
      setWinLine(null);
      setScores(nextScores);
      setAiWaiting(false);
      setAiStats(createEmptyAiResult());
      setLastAiMove(null);
      setPreview(buildPreview(Array(9).fill(null), mode, 'X', difficulty, false, previewDepthLimit));
      saveSettings({ scoreboard: nextScores });
    },
    [difficulty, mode, scores],
  );

  const finishMove = useCallback(
    (nextBoard, playedMark) => {
      const result = boardWinner(nextBoard);
      if (result.winner) {
        const nextScores = {
          ...scores,
          [result.winner]: scores[result.winner] + 1,
        };
        setWinner(result.winner);
        setWinLine(result.line);
        setScores(nextScores);
        setPreview({ scores: {}, evaluatedOrder: [] });
        saveSettings({ scoreboard: nextScores });
        sound.play(result.winner === 'Draw' ? 'draw' : 'win');
        return;
      }

      const nextCurrent = opponent(playedMark);
      setCurrent(nextCurrent);
      setPreview(buildPreview(nextBoard, mode, nextCurrent, difficulty, false, previewDepthLimit));
    },
    [difficulty, mode, previewDepthLimit, scores, sound],
  );

  const makeMove = useCallback(
    (index, forced = false) => {
      if (board[index] || winner) return false;
      if (!forced && activeAi) return false;

      const nextBoard = [...board];
      nextBoard[index] = current;
      setBoard(nextBoard);
      sound.play('click');
      finishMove(nextBoard, current);
      return true;
    },
    [activeAi, board, current, finishMove, sound, winner],
  );

  useEffect(() => {
    setPlayerNames(initialNames ?? defaultPlayerNames(mode, difficulty, language));
  }, [difficulty, initialNames, language, mode]);

  useEffect(() => {
    setPreview(buildPreview(board, mode, current, difficulty, gameOver, previewDepthLimit));
  }, [board, current, difficulty, gameOver, mode, previewDepthLimit]);

  useEffect(() => {
    if (!enabled || !activeAi || aiTimer.current) return undefined;

    setAiWaiting(true);
    sound.play('thinking');
    aiTimer.current = window.setTimeout(
      () => {
        const result = chooseAiMove([...board], current, difficulty, aiStyle(mode, current));
        setAiStats(result);
        setPreview({ scores: result.scores, evaluatedOrder: result.evaluatedOrder });
        setLastAiMove(result.move);
        setAiWaiting(false);
        aiTimer.current = null;

        if (result.move !== null) {
          const nextBoard = [...board];
          nextBoard[result.move] = current;
          setBoard(nextBoard);
          sound.play('click');
          finishMove(nextBoard, current);
        }
      },
      mode === 'human_ai' ? AI_DELAY_MS : DEMO_DELAY_MS,
    );

    return () => {
      window.clearTimeout(aiTimer.current);
      aiTimer.current = null;
      setAiWaiting(false);
    };
  }, [activeAi, board, current, difficulty, enabled, finishMove, mode, sound]);

  const updateNames = useCallback((names) => {
    setPlayerNames(names);
    saveSettings({ playerNames: names });
  }, []);

  const resetScores = useCallback(() => resetRound({ resetScores: true }), [resetRound]);

  const status = useMemo(() => {
    const t = getTranslations(language);
    if (winner === 'Draw') return t.draw;
    if (winner) return `${playerNames[winner]} ${t.wins}`;
    if (aiWaiting) return `${playerNames[current]} ${t.isThinking}`;
    return language === 'ar' ? `${t.turn} ${playerNames[current]}` : `${playerNames[current]}'s ${t.turn}`;
  }, [aiWaiting, current, language, playerNames, winner]);

  return {
    board,
    current,
    winner,
    winLine,
    scores,
    playerNames,
    aiWaiting,
    aiStats,
    preview,
    lastAiMove,
    activeAi,
    status,
    makeMove,
    resetRound,
    resetScores,
    updateNames,
  };
}
