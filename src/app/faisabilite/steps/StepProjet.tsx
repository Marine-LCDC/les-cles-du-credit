"use client";

import {
  MoneyField,
  TextField,
  ChoiceCards,
  Toggle,
  InfoBanner,
} from "../components/fields";
import {
  TAUX_FRAIS_ACQUISITION_ANCIEN,
  TAUX_FRAIS_ACQUISITION_NEUF,
  formatEuros,
} from "../components/frais-preview";
import type { WizardState } from "../wizard-state";
import { parseNombreFr } from "../wizard-state";
import type { TypeBien, TypeProjet } from "@/lib/moteur";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

export function StepProjet({ state, patch }: Props) {
  const prix = parseNombreFr(state.prixAcquisition) ?? 0;
  const taux =
    state.typeBien === "neuf"
      ? TAUX_FRAIS_ACQUISITION_NEUF
      : TAUX_FRAIS_ACQUISITION_ANCIEN;
  const fraisEstimes = prix * taux;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Votre projet immobilier
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Indiquez le bien visé. Vos données ne sont jamais conservées.
      </p>

      <ChoiceCards<TypeProjet>
        label="Nature du projet"
        value={state.typeProjet}
        onChange={(typeProjet) => patch({ typeProjet })}
        options={[
          { value: "residence_principale", label: "Résidence principale" },
          { value: "residence_secondaire", label: "Résidence secondaire" },
          {
            value: "investissement_locatif",
            label: "Investissement locatif",
          },
        ]}
      />

      <TextField
        label="Ville du bien"
        value={state.ville}
        onChange={(ville) => patch({ ville })}
        placeholder="Ex. Toulouse"
      />

      <TextField
        label="Référence (optionnel)"
        value={state.referenceBien}
        onChange={(referenceBien) => patch({ referenceBien })}
        placeholder="Ex. mandat 245"
        hint="Utile si un agent vous a communiqué une référence"
      />

      <MoneyField
        label="Prix d'acquisition"
        value={state.prixAcquisition}
        onChange={(prixAcquisition) => patch({ prixAcquisition })}
        placeholder="230 000"
      />

      <ChoiceCards<TypeBien>
        label="Type de bien"
        value={state.typeBien}
        onChange={(typeBien) => patch({ typeBien })}
        options={[
          {
            value: "ancien",
            label: "Ancien",
            hint: "Frais d'acquisition estimés à 7,5 %",
          },
          {
            value: "neuf",
            label: "Neuf / VEFA",
            hint: "Frais d'acquisition estimés à 2,5 %",
          },
        ]}
      />

      {prix > 0 ? (
        <InfoBanner>
          Frais d'acquisition estimés :{" "}
          <strong className="text-neutral">{formatEuros(fraisEstimes)}</strong>
          {" "}
          (calculés à {(taux * 100).toLocaleString("fr-FR")} % du prix — estimation
          indicative).
        </InfoBanner>
      ) : null}

      <Toggle
        label="Travaux nécessaires"
        checked={state.travauxNecessaires}
        onChange={(travauxNecessaires) => patch({ travauxNecessaires })}
        hint="Travaux pour rendre le bien habitable"
      />

      {state.travauxNecessaires ? (
        <MoneyField
          label="Montant estimé des travaux"
          value={state.travauxMontant}
          onChange={(travauxMontant) => patch({ travauxMontant })}
        />
      ) : null}

      {state.typeProjet === "investissement_locatif" ? (
        <>
          <MoneyField
            label="Loyer mensuel attendu"
            value={state.loyerAttenduLocatif}
            onChange={(loyerAttenduLocatif) => patch({ loyerAttenduLocatif })}
            hint="Pris en compte avec une décote prudente (70 %)"
          />
          <MoneyField
            label="Durée max. habituelle pour un locatif"
            value={state.dureeMaxLocative}
            onChange={(dureeMaxLocative) => patch({ dureeMaxLocative })}
            suffix="ans"
            hint="Hypothèse de marché locale (ex. 20 ans) — pas une règle réglementaire"
          />
        </>
      ) : null}
    </div>
  );
}
