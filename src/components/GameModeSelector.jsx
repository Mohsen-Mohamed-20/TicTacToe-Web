import { DIFFICULTIES } from '../utils/gameLogic';
import { getTranslations, translateDifficulty, translateMode } from '../utils/i18n';

const modeKeys = ['human_ai', 'human_human', 'ai_ai', 'minimax_random'];

const modeColors = {
  human_ai: 'border-cyan/70 text-cyan shadow-cyan',
  human_human: 'border-pink/70 text-pink shadow-pink',
  ai_ai: 'border-lime/70 text-lime shadow-[0_0_24px_rgba(115,255,165,0.25)]',
  minimax_random: 'border-amber/70 text-amber shadow-amber',
};

export default function GameModeSelector({ mode, difficulty, language, onModeChange, onDifficultyChange, onStart, onNames }) {
  const t = getTranslations(language);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-4 py-8">
      <header className="text-center">
        <p className="font-display text-sm font-bold uppercase tracking-[0.38em] text-cyan">{t.arenaTitle}</p>
        <h1 className="mt-2 font-display text-4xl font-black text-white sm:text-6xl">{t.menuTitle}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted sm:text-base">{t.menuSubtitle}</p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {modeKeys.map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => onModeChange(key)}
            className={`rounded-xl border bg-panel/90 p-5 text-left transition hover:-translate-y-0.5 rtl:text-right ${
              mode === key ? modeColors[key] : 'border-white/10 text-white hover:border-cyan/50'
            }`}
          >
            <span className="font-display text-xl font-bold">{translateMode(key, language)}</span>
            <span className="mt-2 block text-sm text-muted">{t.modeDescriptions[key]}</span>
          </button>
        ))}
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DIFFICULTIES.map((level) => (
          <button
            type="button"
            key={level}
            disabled={mode === 'human_human'}
            onClick={() => onDifficultyChange(level)}
            className={`neon-button min-h-14 ${
              difficulty === level && mode !== 'human_human' ? 'border-violet/80 text-violet shadow-[0_0_24px_rgba(150,93,255,0.3)]' : 'border-white/10 text-white'
            } disabled:opacity-40`}
          >
            {translateDifficulty(level, language)}
          </button>
        ))}
      </section>

      {mode === 'human_human' && (
        <button type="button" onClick={onNames} className="neon-button mx-auto mt-5 w-full max-w-sm border-pink/80 text-pink">
          {t.playerNames}
        </button>
      )}

      <button type="button" onClick={onStart} className="neon-button mx-auto mt-7 min-h-16 w-full max-w-sm border-cyan/80 text-xl text-cyan shadow-cyan">
        {t.startGame}
      </button>

      <p className="mt-6 text-center text-xs text-muted">{t.expertHint}</p>
    </main>
  );
}
