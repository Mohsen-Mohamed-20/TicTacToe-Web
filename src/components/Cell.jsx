import { motion } from 'framer-motion';
import { getTranslations } from '../utils/i18n';

export default function Cell({ index, value, disabled, highlight, isBest, isWinning, language, onSelect }) {
  const t = getTranslations(language);
  const color = value === 'X' ? 'text-cyan' : 'text-pink';
  const borderColor = isWinning ? 'border-amber shadow-amber' : 'border-white/10';
  const score = highlight?.score;
  const highlightColor = isBest ? 'bg-amber/25' : score >= 0 ? 'bg-cyan/10' : 'bg-pink/10';

  return (
    <button
      type="button"
      aria-label={`${t.cell} ${index + 1}${value ? ` ${t.occupiedBy} ${value}` : ''}`}
      disabled={disabled || Boolean(value)}
      onClick={() => onSelect(index)}
      className={`relative aspect-square overflow-hidden rounded-lg border ${borderColor} bg-panel2/80 transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan/80 disabled:cursor-default sm:rounded-xl ${
        !value && !disabled ? 'hover:border-cyan/80 hover:shadow-cyan active:scale-[0.98]' : ''
      }`}
    >
      {highlight && !value && (
        <motion.span
          className={`absolute inset-2 rounded-md ${highlightColor}`}
          animate={{ opacity: [0.28, 0.75, 0.28] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: highlight.order * 0.08 }}
        />
      )}

      {value && (
        <motion.span
          initial={{ opacity: 0, scale: 0.35, rotate: value === 'X' ? -20 : 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 19 }}
          className={`absolute inset-0 grid place-items-center font-display text-6xl font-black leading-none sm:text-7xl md:text-8xl ${isWinning ? 'text-amber' : color}`}
          style={{ textShadow: `0 0 28px currentColor` }}
        >
          {value}
        </motion.span>
      )}
    </button>
  );
}
