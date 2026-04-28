import { formatMoveIndex } from '../utils/gameLogic';
import { getTranslations } from '../utils/i18n';

export default function AiStats({ aiWaiting, aiStats, preview, language }) {
  const t = getTranslations(language);
  const rows = [
    [t.state, aiWaiting ? t.thinking : t.ready],
    [t.nodesExplored, aiStats.nodes],
    [t.prunedBranches, aiStats.pruned],
    [t.thinkingTime, `${aiStats.thinkingMs} ${t.milliseconds}`],
    [t.bestMoveIndex, formatMoveIndex(aiStats.bestMoveIndex)],
  ];

  return (
    <section className="rounded-xl border border-white/10 bg-panel/90 p-4">
      <h2 className="font-display text-xl font-bold text-white">{t.aiStats}</h2>
      <dl className="mt-4 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <dt className="text-muted">{label}</dt>
            <dd className="font-display font-bold text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded-lg border border-white/10 bg-panel2/70 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{t.evaluatedOrder}</p>
        <p className="mt-2 min-h-6 break-words font-display text-sm text-cyan">
          {(aiStats.evaluatedOrder?.length ? aiStats.evaluatedOrder : preview.evaluatedOrder)?.join(' -> ') || '-'}
        </p>
      </div>
    </section>
  );
}
