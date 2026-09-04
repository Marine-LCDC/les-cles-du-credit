"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ConsentGate } from "@/components/ConsentGate";
import { SiteFooter } from "@/components/SiteFooter";
import { BANDEAU_RESULTAT } from "@/lib/legal-copy";
import { executerMoteur, type MoteurResult, type SimulationInput } from "@/lib/moteur";
import { EcranResultat } from "./components/EcranResultat";
import { mapWizardToSimulation } from "./map-to-moteur";
import { StepFinancement } from "./steps/StepFinancement";
import { StepFoyer } from "./steps/StepFoyer";
import { StepLignes } from "./steps/StepLignes";
import { StepLiquidites } from "./steps/StepLiquidites";
import { StepLogement } from "./steps/StepLogement";
import { StepProfession } from "./steps/StepProfession";
import { StepProjet } from "./steps/StepProjet";
import { validerEtape } from "./validate";
import {
  ETAPE_LABELS,
  TOTAL_ETAPES,
  etatInitial,
  type WizardState,
} from "./wizard-state";

export default function FaisabiliteClient() {
  const [consentsOk, setConsentsOk] = useState(false);
  const [disclaimerOk, setDisclaimerOk] = useState(false);
  const [rgpdOk, setRgpdOk] = useState(false);
  const [consentErreur, setConsentErreur] = useState<string | null>(null);

  const [etape, setEtape] = useState(1);
  const [state, setState] = useState<WizardState>(etatInitial);
  const [erreur, setErreur] = useState<string | null>(null);
  const [result, setResult] = useState<MoteurResult | null>(null);
  const [simulationInput, setSimulationInput] =
    useState<SimulationInput | null>(null);

  function patch(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
    setErreur(null);
  }

  function validerConsentements() {
    if (!disclaimerOk || !rgpdOk) {
      setConsentErreur(
        "Il manque encore les deux confirmations pour continuer",
      );
      return;
    }
    setConsentErreur(null);
    setConsentsOk(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    const err = validerEtape(etape, state);
    if (err) {
      setErreur(err);
      return;
    }
    setErreur(null);

    if (etape < TOTAL_ETAPES) {
      setEtape((e) => e + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const input = mapWizardToSimulation(state);
      const output = executerMoteur(input);
      setSimulationInput(input);
      setResult(output);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErreur(
        "Le calcul n'a pas pu aboutir avec ces valeurs. Vérifiez les montants saisis.",
      );
    }
  }

  function goPrev() {
    setErreur(null);
    if (result) {
      setResult(null);
      setSimulationInput(null);
      return;
    }
    if (etape > 1) {
      setEtape((e) => e - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function restart() {
    setState(etatInitial());
    setEtape(1);
    setResult(null);
    setSimulationInput(null);
    setErreur(null);
    setConsentsOk(false);
    setDisclaimerOk(false);
    setRgpdOk(false);
    setConsentErreur(null);
  }

  const progress = !consentsOk
    ? 0
    : result
      ? 100
      : ((etape - 1) / TOTAL_ETAPES) * 100;

  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#e1f0ec_0%,transparent_50%),linear-gradient(180deg,#f5efe3_0%,#ebe3d4_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-4 pb-28 pt-8 sm:px-6 sm:pb-12 sm:pt-10">
        <header className="mb-6 flex items-center justify-between">
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
          <span className="text-xs text-neutral-muted">
            {!consentsOk
              ? "Consentements"
              : result
                ? "Résultat"
                : `Étape ${etape} sur ${TOTAL_ETAPES}`}
          </span>
        </header>

        {consentsOk ? (
          <div className="mb-6">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#e6dcc8]"
              role="progressbar"
              aria-valuenow={result ? TOTAL_ETAPES : etape}
              aria-valuemin={1}
              aria-valuemax={TOTAL_ETAPES}
              aria-label="Progression du formulaire"
            >
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {!result ? (
              <p className="mt-2 text-xs text-neutral-muted">
                {ETAPE_LABELS[etape - 1]}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mb-5 rounded-[12px] border border-[#e6dcc8] bg-white/80 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm leading-relaxed text-neutral-muted">
            {BANDEAU_RESULTAT}
          </p>
        </div>

        {!consentsOk ? (
          <ConsentGate
            disclaimerOk={disclaimerOk}
            rgpdOk={rgpdOk}
            onDisclaimerChange={(v) => {
              setDisclaimerOk(v);
              setConsentErreur(null);
            }}
            onRgpdChange={(v) => {
              setRgpdOk(v);
              setConsentErreur(null);
            }}
            onContinue={validerConsentements}
            erreur={consentErreur}
          />
        ) : result && simulationInput ? (
          <EcranResultat
            state={state}
            simulationInput={simulationInput}
            result={result}
            onRestart={restart}
          />
        ) : (
          <>
            {etape === 1 ? <StepProjet state={state} patch={patch} /> : null}
            {etape === 2 ? <StepFoyer state={state} patch={patch} /> : null}
            {etape === 3 ? (
              <StepProfession state={state} patch={patch} />
            ) : null}
            {etape === 4 ? <StepLogement state={state} patch={patch} /> : null}
            {etape === 5 ? <StepLignes state={state} patch={patch} /> : null}
            {etape === 6 ? (
              <StepLiquidites state={state} patch={patch} />
            ) : null}
            {etape === 7 ? (
              <StepFinancement state={state} patch={patch} />
            ) : null}

            {erreur ? (
              <p
                className="mt-2 rounded-[12px] border border-[#f0c4c4] bg-[#fbebeb] px-3.5 py-2.5 text-sm text-status-red"
                role="alert"
              >
                {erreur}
              </p>
            ) : null}

            {/* Nav sticky mobile */}
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e6dcc8] bg-[#f5efe3]/95 px-4 py-3 backdrop-blur-sm sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="mx-auto flex max-w-lg gap-3">
                {etape > 1 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[12px] border border-[#e6dcc8] bg-white px-4 text-base font-medium text-neutral transition-colors hover:bg-brand-light"
                  >
                    Retour
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[12px] border border-[#e6dcc8] bg-white px-4 text-base font-medium text-neutral transition-colors hover:bg-brand-light"
                  >
                    Accueil
                  </Link>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-11 flex-[1.4] items-center justify-center rounded-[12px] bg-brand px-4 text-base font-medium text-white transition-colors hover:bg-[#266b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {etape === TOTAL_ETAPES ? "Voir mon résultat" : "Continuer"}
                </button>
              </div>
            </div>
          </>
        )}

        {(result || !consentsOk) && (
          <SiteFooter className="mt-8" />
        )}
      </div>
    </div>
  );
}
