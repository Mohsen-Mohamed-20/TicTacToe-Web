import { motion } from 'framer-motion';
import Cell from './Cell';
import { getTranslations } from '../utils/i18n';

function lineClass(line) {
  if (!line) return 'hidden';
  const key = line.join('-');
  const classes = {
    '0-1-2': 'top-[16.6%] left-[8%] w-[84%] h-1.5',
    '3-4-5': 'top-1/2 left-[8%] w-[84%] h-1.5',
    '6-7-8': 'top-[83.3%] left-[8%] w-[84%] h-1.5',
    '0-3-6': 'left-[16.6%] top-[8%] h-[84%] w-1.5',
    '1-4-7': 'left-1/2 top-[8%] h-[84%] w-1.5',
    '2-5-8': 'left-[83.3%] top-[8%] h-[84%] w-1.5',
    '0-4-8': 'left-[8%] top-1/2 w-[84%] h-1.5 rotate-45',
    '2-4-6': 'left-[8%] top-1/2 w-[84%] h-1.5 -rotate-45',
  };
  return classes[key] ?? 'hidden';
}

export default function Board({ board, preview, aiWaiting, bestMove, lastAiMove, winLine, language, disabled, onSelect }) {
  const t = getTranslations(language);
  const highlights = Object.fromEntries(
    Object.entries(preview.scores ?? {}).map(([index, score]) => [
      index,
      {
        score,
        order: Math.max(0, preview.evaluatedOrder?.indexOf(Number(index)) ?? 0),
      },
    ]),
  );

  return (
    <section className="relative w-full max-w-[34rem] rounded-2xl border border-cyan/60 bg-panel/95 p-3 shadow-cyan sm:p-4">
      <div className="absolute inset-0 rounded-2xl bg-cyan/5 blur-xl" />
      <div className="relative grid grid-cols-3 gap-2 sm:gap-3">
        {board.map((value, index) => (
          <Cell
            key={index}
            index={index}
            value={value}
            disabled={disabled}
            highlight={highlights[index]}
            isBest={bestMove === index || lastAiMove === index}
            isWinning={winLine?.includes(index)}
            language={language}
            onSelect={onSelect}
          />
        ))}
      </div>

      {winLine && (
        <motion.span
          className={`absolute origin-center rounded-full bg-amber shadow-amber ${lineClass(winLine)}`}
          initial={{ scaleX: 0, scaleY: 0.35, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.62, ease: 'easeOut' }}
        />
      )}

      {aiWaiting && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-center">
          <div className="rounded-full border border-cyan/30 bg-void/85 px-4 py-2 font-display text-xs uppercase tracking-[0.28em] text-cyan shadow-cyan">
            {t.aiThinking}
          </div>
        </div>
      )}
    </section>
  );
}
