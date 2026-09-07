"use client";

import { useState, useTransition } from "react";
import { updateDureeMaxLocative } from "./actions";

type Props = {
  dureeInitiale: number;
  onSaved?: () => void;
};

export function DureeLocativeForm({ dureeInitiale, onSaved }: Props) {
  const [duree, setDuree] = useState(String(dureeInitiale));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const value = Number(duree.replace(/\s/g, "").replace(",", "."));
    startTransition(async () => {
      const result = await updateDureeMaxLocative(Math.round(value));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Durée enregistrée.");
      onSaved?.();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">
          Durée de crédit max. admise pour un investissement locatif
        </span>
        <div className="relative max-w-xs">
          <input
            required
            inputMode="numeric"
            value={duree}
            onChange={(e) => {
              setDuree(e.target.value);
              setMessage(null);
              setError(null);
            }}
            className="w-full min-h-11 rounded-[12px] border border-black/10 bg-white px-3.5 pr-14 text-base outline-none focus:border-[var(--brand-main)] focus:ring-2 focus:ring-[var(--brand-main)]/20"
            placeholder="25"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--neutral-muted)]">
            ans
          </span>
        </div>
        <span className="mt-1.5 block text-xs text-[var(--neutral-muted)]">
          Hypothèse de marché locale (souvent 20 ou 25 ans). Utilisée pour le
          verdict agent sur les projets locatifs — pas une règle réglementaire.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-[12px] border border-black/10 bg-white px-4 text-sm font-medium hover:bg-black/[0.02] disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>

      {message ? (
        <p className="text-sm text-[var(--brand-main)]" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-[var(--status-red)]" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
