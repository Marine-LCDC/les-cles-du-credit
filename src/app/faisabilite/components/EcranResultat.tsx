"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculerIndicateurs,
  fusionnerConstantes,
  TAUX_FRAIS_ACQUISITION_ANCIEN,
  TAUX_FRAIS_ACQUISITION_NEUF,
  type IndicateursFinanciers,
  type MoteurResult,
  type SimulationInput,
  type VerdictNiveau,
} from "@/lib/moteur";
import {
  MENTION_BAS_ECRAN,
  mentionFraisNotaire,
} from "@/lib/legal-copy";
import { OptInMarketing } from "@/components/OptInMarketing";
import { formatEuros } from "./frais-preview";
import type { WizardState } from "../wizard-state";
import { parseNombreFr } from "../wizard-state";

type Props = {
  state: WizardState;
  simulationInput: SimulationInput;
  result: MoteurResult;
  onRestart: () => void;
};

function statusStyles(niveau: VerdictNiveau) {
  switch (niveau) {
    case "VERT":
      return {
        box: "border-[#b9dfc0] bg-[#e7f3ea]",
        label: "text-status-green",
        title: "text-[#2e6b31]",
      };
    case "ORANGE":
      return {
        box: "border-[#f0d4b0] bg-[#fdf3e8]",
        label: "text-status-orange",
        title: "text-[#a05e1a]",
      };
    case "ROUGE":
      return {
        box: "border-[#f0c4c4] bg-[#fbebeb]",
        label: "text-status-red",
        title: "text-[#9a3030]",
      };
  }
}

function sousTexteBadge(
  niveau: VerdictNiveau,
  ind: IndicateursFinanciers,
): string {
  switch (niveau) {
    case "VERT":
      return "Au regard des éléments analysés, le projet paraît compatible avec les principaux critères.";
    case "ORANGE":
      if (ind.tauxEffort > 0.35) {
        return "Le taux d'effort dépasse le seuil de référence de 35 %. Un financement reste envisageable sous réserve d'une analyse bancaire.";
      }
      return "Le financement semble envisageable, mais un ou plusieurs éléments méritent une validation complémentaire.";
    case "ROUGE": {
      const ecart = Math.max(0, ind.capitalEmprunte - ind.capaciteEmpruntable);
      if (ecart > 0) {
        return `Écart de ${formatEuros(ecart)} par rapport à votre capacité estimée.`;
      }
      return "Un ou plusieurs critères rendent le financement peu probable dans la configuration actuelle.";
    }
  }
}

function phraseOptIn(niveau: VerdictNiveau): string {
  switch (niveau) {
    case "VERT":
      return "Votre projet est bien engagé. Pour vos prochains biens, gardez votre simulateur de crédit personnel — c'est gratuit.";
    case "ORANGE":
      return "Pour affiner votre capacité et préparer l'échange avec la banque, gardez votre simulateur personnel — c'est gratuit.";
    case "ROUGE":
      return "Pour explorer d'autres montages et mieux préparer la suite, gardez votre simulateur personnel — c'est gratuit.";
  }
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <>
      <dt
        className={
          strong
            ? "border-t border-[#e6dcc8] pt-2.5 font-medium text-neutral"
            : "text-neutral-muted"
        }
      >
        {label}
      </dt>
      <dd
        className={
          strong
            ? "border-t border-[#e6dcc8] pt-2.5 text-right font-medium text-neutral"
            : "text-right text-neutral"
        }
      >
        {value}
      </dd>
    </>
  );
}

export function EcranResultat({
  state,
  simulationInput,
  result,
  onRestart,
}: Props) {
  const { agentVerdict, indicateurs: indRef } = result.referenceSimulation;
  const dureeRef = indRef.dureeReferenceAnnees;
  const styles = statusStyles(agentVerdict.niveau);

  const dureesPerso = useMemo(() => {
    const options = [25, 20, 15, 12, 10].filter((d) => d < dureeRef);
    return options;
  }, [dureeRef]);

  const [dureePerso, setDureePerso] = useState<number | null>(null);
  const [optIn, setOptIn] = useState(false);
  const [email, setEmail] = useState("");
  const [optInEnvoye, setOptInEnvoye] = useState(false);

  const indPerso = useMemo(() => {
    if (dureePerso === null) return null;
    return calculerIndicateurs(
      simulationInput,
      fusionnerConstantes(),
      { dureeForceeAnnees: dureePerso },
    );
  }, [dureePerso, simulationInput]);

  const prix = parseNombreFr(state.prixAcquisition) ?? 0;
  const travaux = state.travauxNecessaires
    ? (parseNombreFr(state.travauxMontant) ?? 0)
    : 0;
  const refLabel = [
    state.referenceBien ? `réf. ${state.referenceBien}` : null,
    state.ville || null,
  ]
    .filter(Boolean)
    .join(" — ");

  function handleOptIn(e: React.FormEvent) {
    e.preventDefault();
    if (!optIn || !email.trim() || !email.includes("@")) return;
    // Phase 1 : pas encore de backend Brevo — confirmation locale uniquement
    setOptInEnvoye(true);
  }

  return (
    <div>
      <h2 className="sr-only">
        Écran de résultat : {agentVerdict.badge}
        {refLabel ? `, bien ${refLabel}` : ""}
      </h2>

      {refLabel ? (
        <div className="mb-4 flex items-center gap-2 text-sm text-neutral-muted">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
          </svg>
          <p>Bien {refLabel}</p>
        </div>
      ) : null}

      {/* Badge verdict — référence agent, figé */}
      <div
        className={`mb-4 rounded-[16px] border px-4 py-5 text-center ${styles.box}`}
      >
        <p className={`text-sm ${styles.label}`}>Résultat</p>
        <p className={`mt-1 text-xl font-medium ${styles.title}`}>
          {agentVerdict.badge}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-muted">
          {sousTexteBadge(agentVerdict.niveau, indRef)}
        </p>
      </div>

      {/* Détail coût */}
      <div className="mb-3 rounded-[16px] border border-[#e6dcc8] bg-white px-4 py-4">
        <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 text-sm">
          <Row label="Prix du bien" value={formatEuros(prix)} />
          <Row label="Travaux estimés" value={formatEuros(travaux)} />
          <Row
            label="Frais d'acquisition"
            value={formatEuros(indRef.fraisAcquisition)}
          />
          <Row label="Apport" value={`− ${formatEuros(indRef.apportRetenu)}`} />
          <Row
            label="Total à financer"
            value={formatEuros(indRef.capitalEmprunte)}
            strong
          />
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-muted">
          {mentionFraisNotaire(
            state.typeBien,
            (state.typeBien === "neuf"
              ? TAUX_FRAIS_ACQUISITION_NEUF
              : TAUX_FRAIS_ACQUISITION_ANCIEN) * 100,
          )}
        </p>
      </div>

      {/* Mensualité + capacité (référence) */}
      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-[16px] border border-[#e6dcc8] bg-white p-3.5">
          <p className="text-xs text-neutral-muted">Mensualité estimée</p>
          <p className="mt-1 text-[19px] font-medium text-neutral">
            {formatEuros(indRef.mensualiteTotale)}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-muted">
            sur {dureeRef} ans (référence)
          </p>
        </div>
        <div className="rounded-[16px] border border-[#e6dcc8] bg-white p-3.5">
          <p className="text-xs text-neutral-muted">Capacité empruntable</p>
          <p className="mt-1 text-[19px] font-medium text-neutral">
            {formatEuros(indRef.capaciteEmpruntable)}
          </p>
        </div>
      </div>

      {/* Pédagogie */}
      <div className="mb-4 rounded-[16px] border border-[#e6dcc8] bg-white px-4 py-4">
        <p className="mb-3 text-sm font-medium text-neutral">
          Ce que montrent les chiffres
        </p>
        <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 text-sm">
          <Row
            label="Part des revenus consacrée au crédit"
            value={`${(indRef.tauxEffort * 100).toLocaleString("fr-FR", {
              maximumFractionDigits: 1,
            })} %`}
          />
          <Row
            label="Reste disponible chaque mois"
            value={formatEuros(indRef.rav)}
          />
          <Row
            label="Hausse de charge vs aujourd'hui"
            value={formatEuros(indRef.sautDeCharge)}
          />
          {indRef.couvertureSautMois !== null ? (
            <Row
              label="Épargne restante (mois de couverture)"
              value={`${Math.round(indRef.couvertureSautMois)} mois`}
            />
          ) : (
            <Row
              label="Épargne restante après apport"
              value={formatEuros(indRef.epargneResiduelle)}
            />
          )}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-neutral-muted">
          Le « reste disponible » est un indicateur prudentiel interne, pas un
          seuil légal. La part des revenus se compare au seuil de référence de
          35 %.
        </p>
      </div>

      {/* Simulation personnelle — n'altère jamais le badge */}
      {dureesPerso.length > 0 ? (
        <div className="mb-4 rounded-[16px] border border-[#e6dcc8] bg-white px-4 py-4">
          <p className="mb-1 text-sm font-medium text-neutral">
            Tester une durée plus courte
          </p>
          <p className="mb-3 text-xs leading-relaxed text-neutral-muted">
            À titre informatif uniquement. Cela ne modifie pas votre résultat
            de visite ci-dessus.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDureePerso(null)}
              className={`min-h-10 rounded-[12px] border px-3 text-sm font-medium transition-colors ${
                dureePerso === null
                  ? "border-brand bg-brand-light text-neutral"
                  : "border-[#e6dcc8] bg-white text-neutral-muted hover:border-brand/40"
              }`}
            >
              {dureeRef} ans
            </button>
            {dureesPerso.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDureePerso(d)}
                className={`min-h-10 rounded-[12px] border px-3 text-sm font-medium transition-colors ${
                  dureePerso === d
                    ? "border-brand bg-brand-light text-neutral"
                    : "border-[#e6dcc8] bg-white text-neutral-muted hover:border-brand/40"
                }`}
              >
                {d} ans
              </button>
            ))}
          </div>

          {indPerso ? (
            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-[#e6dcc8] pt-4">
              <div>
                <p className="text-xs text-neutral-muted">
                  Mensualité sur {dureePerso} ans
                </p>
                <p className="mt-1 text-lg font-medium text-neutral">
                  {formatEuros(indPerso.mensualiteTotale)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-muted">
                  Part des revenus
                </p>
                <p className="mt-1 text-lg font-medium text-neutral">
                  {(indPerso.tauxEffort * 100).toLocaleString("fr-FR", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  %
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* CTA simulateur inversé — pas de PDF (décision produit) */}
      <Link
        href="/simulateur"
        className="mb-4 inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-[#266b5c]"
      >
        Ouvrir le simulateur de crédit
      </Link>

      {/* Opt-in simulateur gratuit */}
      <div className="mb-3 rounded-[14px] border border-[#e6dcc8] bg-white px-4 py-3.5">
        {optInEnvoye ? (
          <p className="text-sm text-neutral">
            Merci. Vous recevrez votre simulateur dès que l&apos;envoi automatique
            sera activé.
          </p>
        ) : (
          <form onSubmit={handleOptIn}>
            <p className="mb-3 text-sm text-neutral leading-relaxed">
              {phraseOptIn(agentVerdict.niveau)}
            </p>
            <div className="mb-3">
              <OptInMarketing checked={optIn} onChange={setOptIn} />
            </div>
            {optIn ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                  className="mb-3 w-full min-h-10 rounded-[8px] border border-[#e6dcc8] bg-white px-2.5 text-sm text-neutral outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-[12px] border border-brand/40 bg-brand-light px-3 text-sm font-medium text-brand"
                >
                  Recevoir mon simulateur
                </button>
              </>
            ) : null}
          </form>
        )}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[12px] border border-[#e6dcc8] bg-white/80 px-4 text-sm font-medium text-neutral transition-colors hover:bg-brand-light"
      >
        Recommencer une estimation
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#9a9284]">
        {MENTION_BAS_ECRAN}
      </p>
    </div>
  );
}
