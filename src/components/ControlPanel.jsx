import { getTranslations, translateDifficulty, translateMode } from '../utils/i18n';

export default function ControlPanel({
  mode,
  difficulty,
  current,
  playerNames,
  status,
  soundOn,
  language,
  onResetRound,
  onResetScores,
  onBackToMenu,
  onToggleSound,
  onToggleLanguage,
}) {
  const t = getTranslations(language);

  return (
    <section className="rounded-xl border border-white/10 bg-panel/90 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <InfoCard label={t.currentTurn} value={status} color={current === 'X' ? 'text-cyan' : 'text-pink'} />
        <InfoCard label={t.gameMode} value={translateMode(mode, language)} />
        <InfoCard label={t.difficulty} value={translateDifficulty(difficulty, language)} color="text-violet" />
        <InfoCard label="X / O" value={`${playerNames.X} ${t.versus} ${playerNames.O}`} color="text-cyan" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={onResetRound} className="neon-button border-amber/70 text-amber">
          {t.resetRound}
        </button>
        <button type="button" onClick={onResetScores} className="neon-button border-violet/70 text-violet">
          {t.resetScores}
        </button>
        <button type="button" onClick={onBackToMenu} className="neon-button border-pink/70 text-pink">
          {t.menu}
        </button>
        <button type="button" onClick={onToggleSound} className="neon-button border-cyan/70 text-cyan">
          {soundOn ? t.soundOn : t.muted}
        </button>
        <button type="button" onClick={onToggleLanguage} className="neon-button col-span-2 border-white/20 text-white">
          {t.languageName}
        </button>
      </div>
    </section>
  );
}

function InfoCard({ label, value, color = 'text-white' }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel2/80 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-1 truncate font-display text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
