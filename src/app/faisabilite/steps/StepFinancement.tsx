"use client";

import { MoneyField, InfoBanner } from "../components/fields";
import type { WizardState } from "../wizard-state";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

export function StepFinancement({ state, patch }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Financement envisagé
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Dernière étape avant votre indication de visite.
      </p>

      <InfoBanner>
        La durée servant au résultat n&apos;est pas choisie librement : le
        moteur utilise automatiquement la durée maximale réaliste pour votre
        type de projet (25 ans en résidence, ou la durée de marché pour un
        locatif).
      </InfoBanner>

      <MoneyField
        label="Apport personnel"
        value={state.apport}
        onChange={(apport) => patch({ apport })}
      />

      <MoneyField
        label="Taux nominal annuel"
        value={state.tauxNominal}
        onChange={(tauxNominal) => patch({ tauxNominal })}
        suffix="%"
        placeholder="3,50"
        hint="Taux hors assurance, indicatif"
      />

      <MoneyField
        label="Taux d'assurance annuel"
        value={state.tauxAssurance}
        onChange={(tauxAssurance) => patch({ tauxAssurance })}
        suffix="%"
        placeholder="0,34"
        hint="En % du capital emprunté"
      />
    </div>
  );
}
