"use client";

import { useState } from "react";
import type { BienListItem } from "./actions";

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

type Props = {
  biens: BienListItem[];
};

export function BiensRecents({ biens }: Props) {
  const [selectedToken, setSelectedToken] = useState(
    biens[0]?.public_token ?? "",
  );
  const [copied, setCopied] = useState(false);

  if (biens.length === 0) {
    return (
      <p className="text-sm text-[var(--neutral-muted)]">
        Aucun bien pour l’instant. Créez votre première fiche ci-dessus.
      </p>
    );
  }

  const selected =
    biens.find((b) => b.public_token === selectedToken) ?? biens[0];

  async function copySelected() {
    const url = `${window.location.origin}/b/${selected.public_token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">
          Bien récent
        </span>
        <select
          value={selected.public_token}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="w-full min-h-11 rounded-[12px] border border-black/10 bg-white px-3.5 text-base outline-none focus:border-[var(--brand-main)] focus:ring-2 focus:ring-[var(--brand-main)]/20"
        >
          {biens.map((bien) => (
            <option key={bien.id} value={bien.public_token}>
              {bien.reference} · {bien.ville} ·{" "}
              {formatEuros(bien.prix_acquisition)}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2 rounded-[12px] border border-black/5 bg-[#fafafa] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p className="font-medium">
            {selected.reference}
            <span className="font-normal text-[var(--neutral-muted)]">
              {" "}
              · {selected.ville}
            </span>
          </p>
          <p className="mt-0.5 text-[var(--neutral-muted)]">
            {formatEuros(selected.prix_acquisition)} ·{" "}
            {selected.type_bien === "neuf" ? "Neuf" : "Ancien"}
          </p>
        </div>
        <button
          type="button"
          onClick={copySelected}
          className="min-h-11 rounded-[12px] bg-[var(--brand-main)] px-4 text-sm font-medium text-white hover:opacity-95"
        >
          {copied ? "Lien copié" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
