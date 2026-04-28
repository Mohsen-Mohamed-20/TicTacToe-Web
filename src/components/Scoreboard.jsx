import { getTranslations } from '../utils/i18n';

export default function Scoreboard({ scores, playerNames, language }) {
  const t = getTranslations(language);
  const total = Math.max(1, scores.X + scores.O + scores.Draw);
  const rows = [
    { key: 'X', label: `${playerNames.X} [X]`, value: scores.X, color: 'text-cyan', bar: 'bg-cyan' },
    { key: 'O', label: `${playerNames.O} [O]`, value: scores.O, color: 'text-pink', bar: 'bg-pink' },
    { key: 'Draw', label: t.draw, value: scores.Draw, color: 'text-muted', bar: 'bg-muted' },
  ];

  return (
    <section className="rounded-xl border border-white/10 bg-panel/90 p-4">
      <h2 className="font-display text-xl font-bold text-white">{t.scoreboard}</h2>
      <div className="mt-4 space-y-4">
        {rows.map((row) => {
          const rate = Math.round((row.value / total) * 100);
          const rateLabel = row.key === 'Draw' ? t.drawRate : t.winRate;
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className={`min-w-0 truncate font-display text-base font-bold ${row.color}`}>{row.label}</span>
                <span className="font-display text-2xl font-black text-white">{row.value}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/10">
                <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${rate}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted">
                {rate}% {rateLabel}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
