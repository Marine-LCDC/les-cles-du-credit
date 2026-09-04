"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type CreditResult,
  type VariableCalculee,
  calculerVariable,
  formatDuree,
  formatEuros,
  formatEurosPrecis,
  formatPourcent,
} from "@/lib/credit-math";

const MODES: {
  id: VariableCalculee;
  label: string;
  resultLabel: string;
}[] = [
  { id: "mensualite", label: "Mensualité", resultLabel: "Mensualité estimée" },
  { id: "capital", label: "Capital", resultLabel: "Capital empruntable" },
  { id: "duree", label: "Durée", resultLabel: "Durée estimée" },
  { id: "taux", label: "Taux", resultLabel: "Taux estimé" },
];

const DEFAULTS = {
  capital: "250000",
  tauxAnnuel: "3,50",
  dureeAnnees: "25",
  mensualiteTotale: "1320",
  tauxAssuranceAnnuel: "0,34",
};

function parseNombre(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function formatResultValue(cible: VariableCalculee, result: CreditResult): string {
  switch (cible) {
    case "mensualite":
      return formatEurosPrecis(result.mensualiteTotale);
    case "capital":
      return formatEuros(result.capital);
    case "duree":
      return formatDuree(result.dureeAnnees);
    case "taux":
      return formatPourcent(result.tauxAnnuel);
  }
}

type FieldKey =
  | "capital"
  | "tauxAnnuel"
  | "dureeAnnees"
  | "mensualiteTotale"
  | "tauxAssuranceAnnuel";

export default function SimulateurClient() {
  const [cible, setCible] = useState<VariableCalculee>("mensualite");
  const [values, setValues] = useState(DEFAULTS);
  const [submitted, setSubmitted] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [email, setEmail] = useState("");

  const fieldsNeeded: FieldKey[] = useMemo(() => {
    const base: FieldKey[] = ["tauxAssuranceAnnuel"];
    switch (cible) {
      case "mensualite":
        return ["capital", "tauxAnnuel", "dureeAnnees", ...base];
      case "capital":
        return ["mensualiteTotale", "tauxAnnuel", "dureeAnnees", ...base];
      case "duree":
        return ["capital", "mensualiteTotale", "tauxAnnuel", ...base];
      case "taux":
        return ["capital", "mensualiteTotale", "dureeAnnees", ...base];
    }
  }, [cible]);

  const computation = useMemo(() => {
    const missing = fieldsNeeded.filter((k) => {
      const v = parseNombre(values[k]);
      return v === null;
    });
    if (missing.length > 0) {
      return { ok: false as const, missing, error: null, result: null };
    }

    const num = (k: FieldKey) => parseNombre(values[k]) ?? 0;

    try {
      const result = calculerVariable(cible, {
        capital: num("capital"),
        tauxAnnuel: num("tauxAnnuel"),
        dureeAnnees: num("dureeAnnees"),
        mensualiteTotale: num("mensualiteTotale"),
        tauxAssuranceAnnuel: num("tauxAssuranceAnnuel"),
      });

      if (cible === "duree" && (result.dureeAnnees <= 0 || result.dureeAnnees > 50)) {
        return {
          ok: false as const,
          missing: [] as FieldKey[],
          error: "La durée obtenue sort d'une plage réaliste (0 à 50 ans). Vérifiez vos montants.",
          result: null,
        };
      }
      if (cible === "taux" && result.tauxAnnuel > 20) {
        return {
          ok: false as const,
          missing: [] as FieldKey[],
          error: "Le taux obtenu semble irréaliste. Vérifiez mensualité et durée.",
          result: null,
        };
      }

      return { ok: true as const, missing: [] as FieldKey[], error: null, result };
    } catch (e) {
      return {
        ok: false as const,
        missing: [] as FieldKey[],
        error: e instanceof Error ? e.message : "Calcul impossible avec ces valeurs",
        result: null,
      };
    }
  }, [cible, values, fieldsNeeded]);

  function updateField(key: FieldKey, raw: string) {
    setValues((prev) => ({ ...prev, [key]: raw }));
    setSubmitted(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const showResult = submitted && computation.ok && computation.result;
  const modeMeta = MODES.find((m) => m.id === cible)!;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#e1f0ec_0%,transparent_50%),linear-gradient(180deg,#f5efe3_0%,#ebe3d4_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/logo.png"
              alt="Les Clés du Crédit"
              width={36}
              height={36}
              className="rounded-md"
            />
            <span className="font-heading text-sm font-medium text-brand">
              Les Clés du Crédit
            </span>
          </Link>
          <span className="text-xs text-neutral-muted">Simulateur</span>
        </header>

        <div className="mb-6 rounded-[12px] border border-[#e6dcc8] bg-white/80 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm text-neutral-muted leading-relaxed">
            Simulation indicative — ne vaut pas accord de prêt
          </p>
        </div>

        <h1 className="text-2xl font-semibold text-neutral sm:text-3xl">
          Calculez la variable qui vous manque
        </h1>
        <p className="mt-2 text-neutral-muted">
          Choisissez ce que vous voulez estimer. Renseignez les trois autres
          paramètres.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-neutral">
              Je souhaite estimer
            </legend>
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="radiogroup"
              aria-label="Variable à estimer"
            >
              {MODES.map((mode) => {
                const active = cible === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setCible(mode.id);
                      setSubmitted(false);
                    }}
                    className={`min-h-11 rounded-[12px] px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      active
                        ? "bg-brand text-white"
                        : "border border-[#e6dcc8] bg-white/70 text-neutral hover:bg-brand-light"
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-4 rounded-[16px] border border-[#e6dcc8] bg-white p-5">
            {fieldsNeeded.includes("capital") && (
              <Field
                id="capital"
                label="Capital emprunté"
                hint="Ex. 250 000"
                suffix="€"
                value={values.capital}
                onChange={(v) => updateField("capital", v)}
                invalid={submitted && parseNombre(values.capital) === null}
              />
            )}
            {fieldsNeeded.includes("mensualiteTotale") && (
              <Field
                id="mensualite"
                label="Mensualité (assurance comprise)"
                hint="Ex. 1 320"
                suffix="€"
                value={values.mensualiteTotale}
                onChange={(v) => updateField("mensualiteTotale", v)}
                invalid={
                  submitted && parseNombre(values.mensualiteTotale) === null
                }
              />
            )}
            {fieldsNeeded.includes("tauxAnnuel") && (
              <Field
                id="taux"
                label="Taux nominal annuel"
                hint="Ex. 3,50"
                suffix="%"
                value={values.tauxAnnuel}
                onChange={(v) => updateField("tauxAnnuel", v)}
                invalid={submitted && parseNombre(values.tauxAnnuel) === null}
              />
            )}
            {fieldsNeeded.includes("dureeAnnees") && (
              <Field
                id="duree"
                label="Durée"
                hint="Ex. 25"
                suffix="ans"
                value={values.dureeAnnees}
                onChange={(v) => updateField("dureeAnnees", v)}
                invalid={submitted && parseNombre(values.dureeAnnees) === null}
              />
            )}
            <Field
              id="assurance"
              label="Taux d'assurance annuel"
              hint="Ex. 0,34 — sur le capital initial"
              suffix="%"
              value={values.tauxAssuranceAnnuel}
              onChange={(v) => updateField("tauxAssuranceAnnuel", v)}
              invalid={
                submitted && parseNombre(values.tauxAssuranceAnnuel) === null
              }
            />
          </div>

          {submitted && !computation.ok && (
            <p className="rounded-[12px] border border-[#e6dcc8] bg-white px-4 py-3 text-sm text-neutral" role="alert">
              {computation.error ??
                (computation.missing.length > 0
                  ? `Il manque encore ${labelMissing(computation.missing[0])}`
                  : "Vérifiez vos saisies")}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full min-h-11 items-center justify-center rounded-[14px] bg-brand px-6 text-base font-medium text-white transition-colors hover:bg-[#266b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Voir mon résultat
          </button>
        </form>

        {showResult && computation.result && (
          <section
            className="mt-8 space-y-4"
            aria-live="polite"
            aria-label="Résultat de la simulation"
          >
            <div className="rounded-[16px] border border-[#b9dfc0] bg-[#e7f3ea] px-5 py-6 text-center">
              <p className="text-sm text-[#3b9945]">Résultat</p>
              <p className="mt-1 text-sm text-neutral-muted">{modeMeta.resultLabel}</p>
              <p className="mt-2 text-3xl font-semibold text-[#2e6b31]">
                {formatResultValue(cible, computation.result)}
              </p>
            </div>

            <div className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-4">
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-sm">
                <dt className="text-neutral-muted">Capital</dt>
                <dd className="text-right font-medium text-neutral">
                  {formatEuros(computation.result.capital)}
                </dd>
                <dt className="text-neutral-muted">Mensualité hors assurance</dt>
                <dd className="text-right text-neutral">
                  {formatEurosPrecis(computation.result.mensualiteHorsAssurance)}
                </dd>
                <dt className="text-neutral-muted">Assurance mensuelle</dt>
                <dd className="text-right text-neutral">
                  {formatEurosPrecis(computation.result.mensualiteAssurance)}
                </dd>
                <dt className="text-neutral-muted">Mensualité totale</dt>
                <dd className="text-right font-medium text-neutral">
                  {formatEurosPrecis(computation.result.mensualiteTotale)}
                </dd>
                <dt className="text-neutral-muted">Durée</dt>
                <dd className="text-right text-neutral">
                  {formatDuree(computation.result.dureeAnnees)}
                </dd>
                <dt className="text-neutral-muted">Taux nominal</dt>
                <dd className="text-right text-neutral">
                  {formatPourcent(computation.result.tauxAnnuel)}
                </dd>
                <dt className="border-t border-[#e6dcc8] pt-3 text-neutral-muted">
                  Coût total estimé
                </dt>
                <dd className="border-t border-[#e6dcc8] pt-3 text-right font-medium text-neutral">
                  {formatEuros(computation.result.coutTotalCredit)}
                </dd>
                <dt className="text-neutral-muted">dont intérêts</dt>
                <dd className="text-right text-neutral">
                  {formatEuros(computation.result.coutInterets)}
                </dd>
                <dt className="text-neutral-muted">dont assurance</dt>
                <dd className="text-right text-neutral">
                  {formatEuros(computation.result.coutAssurance)}
                </dd>
              </dl>
            </div>

            <div className="rounded-[14px] border border-[#e6dcc8] bg-white px-4 py-4">
              <p className="text-sm text-neutral">
                Pour vos prochains projets, gardez votre simulateur personnel —
                c&apos;est gratuit.
              </p>
              <label className="mt-3 flex items-start gap-2 text-xs text-neutral-muted">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.checked)}
                />
                <span>
                  Je souhaite recevoir mon simulateur de crédit personnel offert
                </span>
              </label>
              {emailOptIn && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="mt-3 w-full rounded-[8px] border border-[#e6dcc8] px-3 py-2 text-sm text-neutral outline-none focus:border-brand"
                  autoComplete="email"
                />
              )}
              {emailOptIn && (
                <p className="mt-2 text-xs text-neutral-muted">
                  L&apos;envoi par email sera disponible prochainement. Aucune
                  donnée n&apos;est enregistrée pour le moment.
                </p>
              )}
            </div>

            <p className="text-xs leading-relaxed text-[#9a9284]">
              Estimation indicative fondée sur un crédit amortissable à taux
              fixe. Elle ne constitue ni un accord de prêt, ni un conseil en
              financement. Vos données financières ne sont pas conservées.
            </p>
          </section>
        )}

        <p className="mt-10 text-center text-sm text-neutral-muted">
          <Link href="/" className="text-brand underline-offset-2 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

function labelMissing(key: FieldKey): string {
  switch (key) {
    case "capital":
      return "le capital";
    case "tauxAnnuel":
      return "le taux";
    case "dureeAnnees":
      return "la durée";
    case "mensualiteTotale":
      return "la mensualité";
    case "tauxAssuranceAnnuel":
      return "le taux d'assurance";
  }
}

function Field({
  id,
  label,
  hint,
  suffix,
  value,
  onChange,
  invalid,
}: {
  id: string;
  label: string;
  hint: string;
  suffix: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={`${id}-hint`}
          className={`w-full rounded-[12px] border bg-sable-light/40 py-2.5 pl-3 pr-12 text-base text-neutral outline-none transition-colors focus:border-brand focus:bg-white ${
            invalid ? "border-status-red" : "border-[#e6dcc8]"
          }`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-muted">
          {suffix}
        </span>
      </div>
      <p id={`${id}-hint`} className="mt-1 text-xs text-neutral-muted">
        {hint}
      </p>
    </div>
  );
}
