"use client";

import { useMemo, useState, useTransition } from "react";
import {
  TAUX_FRAIS_ACQUISITION_ANCIEN,
  TAUX_FRAIS_ACQUISITION_NEUF,
} from "@/lib/moteur/constantes";
import type { TypeBien } from "@/lib/supabase/database.types";
import { createBien } from "./actions";

function parseEuroInput(raw: string): number {
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(",", ".")
    .trim();
  if (!cleaned) return NaN;
  return Number(cleaned);
}

function formatEuroInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

const fieldClass =
  "w-full min-h-11 rounded-[12px] border border-black/10 bg-white px-3.5 text-base text-[var(--neutral-dark)] outline-none transition-colors placeholder:text-[var(--neutral-muted)]/60 focus:border-[var(--brand-main)] focus:ring-2 focus:ring-[var(--brand-main)]/20";

type Props = {
  onCreated?: (token: string) => void;
};

export function FicheBienForm({ onCreated }: Props) {
  const [reference, setReference] = useState("");
  const [nomResidence, setNomResidence] = useState("");
  const [ville, setVille] = useState("");
  const [adresseComplete, setAdresseComplete] = useState("");
  const [prixRaw, setPrixRaw] = useState("");
  const [typeBien, setTypeBien] = useState<TypeBien>("ancien");
  const [fraisOverride, setFraisOverride] = useState<number | null>(null);
  const [editFrais, setEditFrais] = useState(false);
  const [fraisRaw, setFraisRaw] = useState("");
  const [travauxNecessaires, setTravauxNecessaires] = useState(false);
  const [travauxRaw, setTravauxRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const prix = parseEuroInput(prixRaw);
  const taux =
    typeBien === "neuf"
      ? TAUX_FRAIS_ACQUISITION_NEUF
      : TAUX_FRAIS_ACQUISITION_ANCIEN;
  const fraisAuto = Number.isFinite(prix) && prix > 0 ? prix * taux : 0;
  const fraisAffiche = fraisOverride ?? fraisAuto;

  const tauxLabel = useMemo(
    () => `${(taux * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`,
    [taux],
  );

  function onTypeChange(next: TypeBien) {
    setTypeBien(next);
    setFraisOverride(null);
    setEditFrais(false);
  }

  function onPrixBlur() {
    if (Number.isFinite(prix) && prix > 0) {
      setPrixRaw(formatEuroInput(prix));
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const travauxMontant = travauxNecessaires
      ? parseEuroInput(travauxRaw)
      : 0;

    startTransition(async () => {
      const result = await createBien({
        reference,
        nomResidence,
        adresseComplete,
        ville,
        prixAcquisition: prix,
        typeBien,
        fraisAcquisition: fraisAffiche,
        travauxNecessaires,
        travauxMontant: Number.isFinite(travauxMontant) ? travauxMontant : 0,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const url = `${window.location.origin}/b/${result.token}`;
      setCreatedLink(url);
      onCreated?.(result.token);
      setReference("");
      setNomResidence("");
      setVille("");
      setAdresseComplete("");
      setPrixRaw("");
      setTypeBien("ancien");
      setFraisOverride(null);
      setEditFrais(false);
      setTravauxNecessaires(false);
      setTravauxRaw("");
    });
  }

  return (
    <div className="space-y-5">
      {createdLink ? (
        <div className="rounded-[12px] border border-[var(--brand-main)]/25 bg-[var(--brand-light)] p-4">
          <p className="font-heading text-base font-semibold text-[var(--neutral-dark)]">
            Lien prêt à envoyer
          </p>
          <p className="mt-1 text-sm text-[var(--neutral-muted)]">
            Réutilisable pour plusieurs visiteurs sur ce bien.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={createdLink}
              className={`${fieldClass} text-sm`}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              onClick={() => copyLink(createdLink)}
              className="min-h-11 shrink-0 rounded-[12px] bg-[var(--brand-main)] px-4 text-sm font-medium text-white hover:opacity-95"
            >
              {copied ? "Copié" : "Copier le lien"}
            </button>
          </div>
          <button
            type="button"
            className="mt-3 text-sm font-medium text-[var(--brand-main)] underline-offset-2 hover:underline"
            onClick={() => setCreatedLink(null)}
          >
            Créer une autre fiche
          </button>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-sm font-medium">Référence</span>
            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex. Mandat 245"
              className={fieldClass}
            />
            <span className="mt-1.5 block text-xs text-[var(--neutral-muted)]">
              Visible par le visiteur.
            </span>
          </label>

          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-sm font-medium">
              Nom de la résidence{" "}
              <span className="font-normal text-[var(--neutral-muted)]">
                (optionnel)
              </span>
            </span>
            <input
              value={nomResidence}
              onChange={(e) => setNomResidence(e.target.value)}
              placeholder="Ex. Résidence Les Lilas"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Ville</span>
          <input
            required
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ex. Lyon"
            className={fieldClass}
          />
          <span className="mt-1.5 block text-xs text-[var(--neutral-muted)]">
            Seule info de localisation montrée au visiteur.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Adresse complète
          </span>
          <input
            required
            value={adresseComplete}
            onChange={(e) => setAdresseComplete(e.target.value)}
            placeholder="12 rue Exemple, 69003 Lyon"
            className={fieldClass}
          />
          <span className="mt-1.5 block text-xs text-[var(--neutral-muted)]">
            Usage interne uniquement — jamais affichée au client.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Prix d’acquisition
            </span>
            <div className="relative">
              <input
                required
                inputMode="decimal"
                value={prixRaw}
                onChange={(e) => {
                  setPrixRaw(e.target.value);
                  setFraisOverride(null);
                }}
                onBlur={onPrixBlur}
                placeholder="250 000"
                className={`${fieldClass} pr-10`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--neutral-muted)]">
                €
              </span>
            </div>
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Type de bien</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "ancien", label: "Ancien" },
                  { value: "neuf", label: "Neuf" },
                ] as const
              ).map((opt) => {
                const selected = typeBien === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onTypeChange(opt.value)}
                    className={`min-h-11 rounded-[12px] border px-3 text-sm font-medium transition-colors ${
                      selected
                        ? "border-[var(--brand-main)] bg-[var(--brand-light)] text-[var(--neutral-dark)]"
                        : "border-black/10 bg-white text-[var(--neutral-muted)] hover:border-[var(--brand-main)]/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="rounded-[12px] border border-black/5 bg-[#fafafa] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Frais d’acquisition estimés</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--brand-main)]">
                {formatEuros(fraisAffiche)}
              </p>
              <p className="mt-1 text-xs text-[var(--neutral-muted)]">
                Calculés à {tauxLabel} sur le prix seul
                {fraisOverride !== null ? " · montant modifié" : ""}.
              </p>
            </div>
            {!editFrais ? (
              <button
                type="button"
                onClick={() => {
                  setEditFrais(true);
                  setFraisRaw(formatEuroInput(fraisAffiche));
                }}
                className="min-h-11 rounded-[12px] border border-black/10 bg-white px-4 text-sm font-medium hover:bg-black/[0.02]"
              >
                Modifier
              </button>
            ) : null}
          </div>

          {editFrais ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="block flex-1">
                <span className="mb-1.5 block text-sm font-medium">
                  Montant en euros
                </span>
                <div className="relative">
                  <input
                    inputMode="decimal"
                    value={fraisRaw}
                    onChange={(e) => setFraisRaw(e.target.value)}
                    className={`${fieldClass} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--neutral-muted)]">
                    €
                  </span>
                </div>
              </label>
              <button
                type="button"
                onClick={() => {
                  const value = parseEuroInput(fraisRaw);
                  if (!Number.isFinite(value) || value < 0) {
                    setError("Montant de frais invalide.");
                    return;
                  }
                  setFraisOverride(Math.round(value));
                  setEditFrais(false);
                  setError(null);
                }}
                className="min-h-11 rounded-[12px] bg-[var(--brand-main)] px-4 text-sm font-medium text-white"
              >
                Valider
              </button>
              <button
                type="button"
                onClick={() => {
                  setFraisOverride(null);
                  setEditFrais(false);
                }}
                className="min-h-11 rounded-[12px] border border-black/10 bg-white px-4 text-sm font-medium"
              >
                Recalculer
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="button"
            role="switch"
            aria-checked={travauxNecessaires}
            onClick={() => setTravauxNecessaires((v) => !v)}
            className="flex w-full min-h-11 items-center justify-between gap-3 rounded-[12px] border border-black/10 bg-white px-4 py-3 text-left"
          >
            <span>
              <span className="block text-sm font-medium">
                Travaux nécessaires
              </span>
              <span className="mt-0.5 block text-xs text-[var(--neutral-muted)]">
                Ajoute une ligne séparée au coût global.
              </span>
            </span>
            <span
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                travauxNecessaires
                  ? "bg-[var(--brand-main)]"
                  : "bg-[#d9d2c4]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  travauxNecessaires ? "translate-x-5" : ""
                }`}
              />
            </span>
          </button>

          {travauxNecessaires ? (
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium">
                Montant des travaux
              </span>
              <div className="relative">
                <input
                  required
                  inputMode="decimal"
                  value={travauxRaw}
                  onChange={(e) => setTravauxRaw(e.target.value)}
                  placeholder="15 000"
                  className={`${fieldClass} pr-10`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--neutral-muted)]">
                  €
                </span>
              </div>
            </label>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-[12px] border border-[#f0c4c4] bg-[#fbebeb] px-3.5 py-2.5 text-sm text-[var(--status-red)]"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full rounded-[12px] bg-[var(--brand-main)] px-4 text-base font-medium text-white transition hover:opacity-95 disabled:opacity-60 sm:w-auto sm:min-w-56"
        >
          {pending ? "Création…" : "Créer le lien"}
        </button>
      </form>
    </div>
  );
}
