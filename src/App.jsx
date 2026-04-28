import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AiStats from './components/AiStats';
import Board from './components/Board';
import ControlPanel from './components/ControlPanel';
import EndGameOverlay from './components/EndGameOverlay';
import GameModeSelector from './components/GameModeSelector';
import PlayerNameModal from './components/PlayerNameModal';
import Scoreboard from './components/Scoreboard';
import { defaultPlayerNames, isArabicText } from './utils/gameLogic';
import { getTranslations, translateDifficulty, translateMode } from './utils/i18n';
import { loadSettings, saveSettings } from './utils/storage';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [screen, setScreen] = useState('menu');
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia('(max-width: 640px)').matches));
  const sound = useSound(settings.soundOn);
  const t = getTranslations(settings.language);

  const names = useMemo(() => {
    const defaults = defaultPlayerNames(settings.selectedMode, settings.difficulty, settings.language);
    const hasCustomHumanNames = settings.playerNames.X !== 'Human' || settings.playerNames.O !== 'AI';
    return settings.selectedMode === 'human_human' && hasCustomHumanNames ? { ...defaults, ...settings.playerNames } : defaults;
  }, [settings.difficulty, settings.language, settings.playerNames, settings.selectedMode]);

  const game = useGame({
    mode: settings.selectedMode,
    difficulty: settings.difficulty,
    initialNames: names,
    initialScores: settings.scoreboard,
    sound,
    language: settings.language,
    enabled: screen === 'game',
    previewDepthLimit: isSmallScreen ? 4 : 9,
  });

  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings.language]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setIsSmallScreen(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  function patchSettings(patch) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      saveSettings(next);
      return next;
    });
  }

  function startGame() {
    game.updateNames(names);
    game.resetRound();
    setScreen('game');
  }

  function backToMenu() {
    game.resetScores();
    setScreen('menu');
  }

  function toggleLanguage() {
    patchSettings({ language: settings.language === 'ar' ? 'en' : 'ar' });
  }

  function toggleSound() {
    patchSettings({ soundOn: !settings.soundOn });
  }

  function saveNames(nextNames) {
    patchSettings({ playerNames: nextNames });
    game.updateNames(nextNames);
  }

  if (screen === 'menu') {
    return (
      <AppShell language={settings.language} onToggleLanguage={toggleLanguage} soundOn={settings.soundOn} onToggleSound={toggleSound}>
        <GameModeSelector
          mode={settings.selectedMode}
          difficulty={settings.difficulty}
          language={settings.language}
          onModeChange={(selectedMode) => patchSettings({ selectedMode })}
          onDifficultyChange={(difficulty) => patchSettings({ difficulty })}
          onStart={startGame}
          onNames={() => setNameModalOpen(true)}
        />
        <PlayerNameModal open={nameModalOpen} names={names} language={settings.language} onClose={() => setNameModalOpen(false)} onSave={saveNames} />
      </AppShell>
    );
  }

  return (
    <AppShell language={settings.language} onToggleLanguage={toggleLanguage} soundOn={settings.soundOn} onToggleSound={toggleSound}>
      <main className="mx-auto grid min-h-svh w-full max-w-7xl content-center gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-8">
        <section>
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-black text-white sm:text-4xl">{t.appTitle}</h1>
              <p className="mt-1 text-sm text-cyan">
                {translateMode(settings.selectedMode, settings.language)} · {translateDifficulty(settings.difficulty, settings.language)}
              </p>
              <p className="mt-1 max-w-xl truncate text-xs text-muted">
                X: <Name value={game.playerNames.X} /> &nbsp; O: <Name value={game.playerNames.O} />
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => game.resetRound()} className="neon-button border-amber/70 text-amber">
                {t.restart}
              </button>
              <button type="button" onClick={backToMenu} className="neon-button border-pink/70 text-pink">
                {t.back}
              </button>
            </div>
          </header>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <Board
              board={game.board}
              preview={game.preview}
              aiWaiting={game.aiWaiting}
              bestMove={game.aiStats.bestMoveIndex}
              lastAiMove={game.lastAiMove}
              winLine={game.winLine}
              language={settings.language}
              disabled={game.aiWaiting || game.activeAi || Boolean(game.winner)}
              onSelect={game.makeMove}
            />
            <EndGameOverlay winner={game.winner} playerNames={game.playerNames} language={settings.language} onPlayAgain={() => game.resetRound()} onMenu={backToMenu} />
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <Scoreboard scores={game.scores} playerNames={game.playerNames} language={settings.language} />
          <ControlPanel
            mode={settings.selectedMode}
            difficulty={settings.difficulty}
            current={game.current}
            playerNames={game.playerNames}
            status={game.status}
            soundOn={settings.soundOn}
            language={settings.language}
            onResetRound={() => game.resetRound()}
            onResetScores={game.resetScores}
            onBackToMenu={backToMenu}
            onToggleSound={toggleSound}
            onToggleLanguage={toggleLanguage}
          />
          <AiStats aiWaiting={game.aiWaiting} aiStats={game.aiStats} preview={game.preview} language={settings.language} />
        </aside>
      </main>
    </AppShell>
  );
}

function AppShell({ children, language, soundOn, onToggleLanguage, onToggleSound }) {
  const t = getTranslations(language);

  return (
    <div className="relative min-h-svh overflow-hidden bg-void text-white">
      <div className="cyber-grid absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,225,255,0.16),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,57,123,0.13),transparent_26%)]" />
      <div className="fixed right-3 top-3 z-40 flex gap-2">
        <button type="button" onClick={onToggleSound} className="icon-button" aria-label={soundOn ? t.muteSound : t.enableSound}>
          {soundOn ? '♪' : '×'}
        </button>
        <button type="button" onClick={onToggleLanguage} className="icon-button min-w-12" aria-label={t.toggleLanguage}>
          {language === 'ar' ? 'EN' : 'ع'}
        </button>
      </div>
      <motion.div className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        {children}
      </motion.div>
    </div>
  );
}

function Name({ value }) {
  return <span dir={isArabicText(value) ? 'rtl' : 'ltr'}>{value}</span>;
}
