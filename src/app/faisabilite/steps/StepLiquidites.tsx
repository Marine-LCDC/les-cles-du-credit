"use client";

import { MoneyField } from "../components/fields";
import type { WizardState } from "../wizard-state";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

export function StepLiquidites({ state, patch }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Votre épargne
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Ces montants aident à calibrer l&apos;apport et la solidité du projet.
      </p>

      <MoneyField
        label="Épargne disponible"
        value={state.epargneDisponible}
        onChange={(epargneDisponible) => patch({ epargneDisponible })}
        hint="Liquidités mobilisables pour ce projet"
      />

      <MoneyField
        label="Épargne mensuelle moyenne"
        value={state.epargneMensuelleMoyenne}
        onChange={(epargneMensuelleMoyenne) =>
          patch({ epargneMensuelleMoyenne })
        }
        hint="Ce que vous mettez de côté chaque mois en moyenne"
      />
    </div>
  );
}
