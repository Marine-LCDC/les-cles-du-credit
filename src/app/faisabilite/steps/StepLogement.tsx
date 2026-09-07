"use client";

import {
  MoneyField,
  ChoiceCards,
  SelectField,
  InfoBanner,
} from "../components/fields";
import type { WizardState } from "../wizard-state";
import type { ScenarioAncienBien, StatutLogement } from "@/lib/moteur";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

export function StepLogement({ state, patch }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Logement actuel
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Ces éléments permettent d&apos;estimer l&apos;écart de charge avec le
        nouveau projet.
      </p>

      <ChoiceCards<StatutLogement>
        label="Vous êtes actuellement"
        value={state.statutLogement}
        onChange={(statutLogement) => patch({ statutLogement })}
        options={[
          { value: "locataire", label: "Locataire" },
          { value: "proprietaire", label: "Propriétaire" },
          { value: "heberge", label: "Hébergé à titre gratuit" },
        ]}
      />

      {state.statutLogement === "heberge" ? (
        <InfoBanner>
          Sans charge de logement actuelle, l&apos;écart avec la future
          mensualité sera intégral — c&apos;est normal.
        </InfoBanner>
      ) : (
        <MoneyField
          label={
            state.statutLogement === "locataire"
              ? "Loyer mensuel actuel"
              : "Mensualité de crédit actuelle"
          }
          value={state.chargeLogementMensuelle}
          onChange={(chargeLogementMensuelle) =>
            patch({ chargeLogementMensuelle })
          }
        />
      )}

      {state.statutLogement === "proprietaire" ? (
        <>
          <MoneyField
            label="Capital restant dû"
            value={state.capitalRestantDu}
            onChange={(capitalRestantDu) => patch({ capitalRestantDu })}
            hint="Montant qu'il vous reste à rembourser sur ce bien"
          />

          <SelectField<ScenarioAncienBien | "">
            label="Projet pour ce logement"
            value={state.scenarioAncienBien}
            onChange={(scenarioAncienBien) => patch({ scenarioAncienBien })}
            options={[
              { value: "", label: "Choisir…" },
              { value: "vente", label: "Je vends" },
              { value: "location", label: "Je mets en location" },
              { value: "indecis", label: "Pas encore tranché" },
            ]}
          />

          {state.scenarioAncienBien === "vente" ? (
            <MoneyField
              label="Prix de vente estimé"
              value={state.prixVenteEstime}
              onChange={(prixVenteEstime) => patch({ prixVenteEstime })}
              hint="Une marge de frais de vente de 7 % sera appliquée"
            />
          ) : null}

          {state.scenarioAncienBien === "location" ? (
            <>
              <InfoBanner>
                Comme vous conservez ce logement, sa mensualité de crédit
                restera prise en compte automatiquement. Indiquez seulement le
                loyer que vous comptez encaisser — une part prudente sera
                retenue dans l&apos;analyse. Vous n&apos;aurez pas à le
                ressaisir à l&apos;étape suivante.
              </InfoBanner>
              <MoneyField
                label="Loyer mensuel attendu sur ce logement"
                value={state.loyerAttenduAncienBien}
                onChange={(loyerAttenduAncienBien) =>
                  patch({ loyerAttenduAncienBien })
                }
                hint="Laissez vide s'il n'y a pas encore de locataire"
              />
            </>
          ) : null}

          {state.scenarioAncienBien === "indecis" ? (
            <MoneyField
              label="Loyer éventuellement conservé après l'opération"
              value={state.loyerRestantApresOperation}
              onChange={(loyerRestantApresOperation) =>
                patch({ loyerRestantApresOperation })
              }
              hint="Laissez vide si aucune charge de logement ne reste"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
