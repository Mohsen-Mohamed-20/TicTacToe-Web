import { motion } from 'framer-motion';
import { getTranslations } from '../utils/i18n';

export default function EndGameOverlay({ winner, playerNames, language, onPlayAgain, onMenu }) {
  if (!winner) return null;

  const t = getTranslations(language);
  const isDraw = winner === 'Draw';
  const headline = isDraw ? t.draw : `${playerNames[winner]} ${t.wins}`;

  return (
    <div className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-void/80 p-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-sm rounded-2xl border bg-panel p-5 text-center ${isDraw ? 'border-cyan/60 shadow-cyan' : 'border-amber/60 shadow-amber'}`}
      >
        <h2 className={`truncate font-display text-4xl font-black ${isDraw ? 'text-cyan' : 'text-amber'}`}>{headline}</h2>
        <p className="mt-2 text-sm text-muted">{isDraw ? t.noWinner : t.perfectLine}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={onPlayAgain} className="neon-button border-cyan/70 text-cyan">
            {t.playAgain}
          </button>
          <button type="button" onClick={onMenu} className="neon-button border-pink/70 text-pink">
            {t.menu}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
