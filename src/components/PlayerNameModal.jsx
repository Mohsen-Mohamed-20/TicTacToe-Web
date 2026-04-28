import { useEffect, useState } from 'react';
import { getTranslations } from '../utils/i18n';

export default function PlayerNameModal({ open, names, language, onClose, onSave }) {
  const [draft, setDraft] = useState(names);
  const t = getTranslations(language);

  useEffect(() => {
    setDraft(names);
  }, [names, open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    onSave({
      X: draft.X.trim() || t.defaultNames.player1,
      O: draft.O.trim() || t.defaultNames.player2,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-void/80 p-4 backdrop-blur">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-cyan/40 bg-panel p-5 shadow-cyan">
        <h2 className="font-display text-2xl font-black text-white">{t.playerNamesTitle}</h2>
        <p className="mt-1 text-sm text-muted">{t.playerNamesHelp}</p>

        <label className="mt-5 block">
          <span className="font-display text-sm font-bold text-cyan">{t.firstPlayer}</span>
          <input
            value={draft.X}
            maxLength={18}
            onChange={(event) => setDraft((next) => ({ ...next, X: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-cyan/40 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          />
        </label>

        <label className="mt-4 block">
          <span className="font-display text-sm font-bold text-pink">{t.secondPlayer}</span>
          <input
            value={draft.O}
            maxLength={18}
            onChange={(event) => setDraft((next) => ({ ...next, O: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-pink/40 bg-void px-4 py-3 text-white outline-none focus:border-pink"
          />
        </label>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={onClose} className="neon-button border-pink/70 text-pink">
            {t.back}
          </button>
          <button type="submit" className="neon-button border-cyan/70 text-cyan">
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}
