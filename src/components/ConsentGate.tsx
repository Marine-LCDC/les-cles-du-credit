"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  DISCLAIMER_CHECKBOX_LABEL,
  DISCLAIMER_INTRO,
  RGPD_CHECKBOX_LABEL,
  consentementRgpdDetail,
} from "@/lib/legal-copy";

type Props = {
  disclaimerOk: boolean;
  rgpdOk: boolean;
  onDisclaimerChange: (v: boolean) => void;
  onRgpdChange: (v: boolean) => void;
  onContinue: () => void;
  erreur?: string | null;
};

function ConsentRow({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  detail: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 rounded-[16px] border border-[#e6dcc8] bg-white px-4 py-4">
      <label className="flex items-start gap-3 text-sm text-neutral">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#e6dcc8] accent-brand"
        />
        <span className="min-w-0 flex-1 leading-relaxed">
          {label}{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpen((v) => !v);
            }}
            className="font-medium text-brand underline-offset-2 hover:underline"
            aria-expanded={open}
          >
            {open ? "Masquer le détail" : "Voir le détail"}
          </button>
        </span>
      </label>
      {open ? (
        <div className="mt-3 rounded-[12px] bg-[#faf6ee] px-3.5 py-3 text-xs leading-relaxed whitespace-pre-line text-neutral-muted">
          {detail}
        </div>
      ) : null}
    </div>
  );
}

export function ConsentGate({
  disclaimerOk,
  rgpdOk,
  onDisclaimerChange,
  onRgpdChange,
  onContinue,
  erreur,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Avant de commencer
      </h2>
      <p className="mt-2 mb-5 text-sm text-neutral-muted">
        Deux confirmations sont nécessaires. Aucune case n&apos;est pré-cochée.
      </p>

      <ConsentRow
        checked={disclaimerOk}
        onChange={onDisclaimerChange}
        label={DISCLAIMER_CHECKBOX_LABEL}
        detail={DISCLAIMER_INTRO}
      />

      <ConsentRow
        checked={rgpdOk}
        onChange={onRgpdChange}
        label={RGPD_CHECKBOX_LABEL}
        detail={
          <>
            {consentementRgpdDetail()}
            <p className="mt-2">
              Voir aussi la{" "}
              <Link
                href="/confidentialite"
                className="text-brand underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </>
        }
      />

      {erreur ? (
        <p
          className="mb-4 rounded-[12px] border border-[#f0c4c4] bg-[#fbebeb] px-3.5 py-2.5 text-sm text-status-red"
          role="alert"
        >
          {erreur}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[12px] bg-brand px-4 text-base font-medium text-white transition-colors hover:bg-[#266b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Commencer mon estimation
      </button>

      <p className="mt-4 text-center text-xs text-neutral-muted">
        <Link
          href="/mentions-legales"
          className="text-brand underline-offset-2 hover:underline"
        >
          Mentions légales
        </Link>
        {" · "}
        <Link
          href="/confidentialite"
          className="text-brand underline-offset-2 hover:underline"
        >
          Confidentialité
        </Link>
      </p>
    </div>
  );
}
