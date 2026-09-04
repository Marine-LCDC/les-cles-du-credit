"use client";

import { TextField, SelectField, Toggle, InfoBanner } from "../components/fields";
import type { RegimeMatrimonial, WizardState } from "../wizard-state";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

export function StepFoyer({ state, patch }: Props) {
  const forceCo = state.regime === "marie_communaute";
  const showCo = state.coEmprunt || forceCo;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Acheteurs et foyer
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Qui emprunte, et combien de personnes à charge dans le foyer.
      </p>

      <SelectField<RegimeMatrimonial>
        label="Situation familiale"
        value={state.regime}
        onChange={(regime) => {
          if (regime === "marie_communaute") {
            patch({ regime, coEmprunt: true });
          } else {
            patch({ regime });
          }
        }}
        options={[
          { value: "celibataire", label: "Célibataire" },
          { value: "marie_separation", label: "Marié·e — séparation de biens" },
          { value: "marie_communaute", label: "Marié·e — communauté" },
          { value: "pacse", label: "Pacsé·e" },
          { value: "divorce", label: "Divorcé·e" },
          { value: "veuf", label: "Veuf·ve" },
        ]}
      />

      {forceCo ? (
        <InfoBanner>
          Votre régime matrimonial vous impose un emprunt en commun. Le
          co-emprunteur est ajouté automatiquement.
        </InfoBanner>
      ) : (
        <Toggle
          label="Emprunt à deux"
          checked={state.coEmprunt}
          onChange={(coEmprunt) => patch({ coEmprunt })}
          hint="Ajoutez un co-emprunteur si vous empruntez ensemble"
        />
      )}

      <p className="mb-3 text-sm font-medium text-neutral">Emprunteur 1</p>
      <div className="grid gap-0 sm:grid-cols-2 sm:gap-3">
        <TextField
          label="Prénom"
          value={state.e1.prenom}
          onChange={(prenom) => patch({ e1: { ...state.e1, prenom } })}
          autoComplete="given-name"
        />
        <TextField
          label="Nom"
          value={state.e1.nom}
          onChange={(nom) => patch({ e1: { ...state.e1, nom } })}
          autoComplete="family-name"
        />
      </div>

      {showCo ? (
        <>
          <p className="mb-3 mt-2 text-sm font-medium text-neutral">
            Co-emprunteur
          </p>
          <div className="grid gap-0 sm:grid-cols-2 sm:gap-3">
            <TextField
              label="Prénom"
              value={state.e2.prenom}
              onChange={(prenom) => patch({ e2: { ...state.e2, prenom } })}
            />
            <TextField
              label="Nom"
              value={state.e2.nom}
              onChange={(nom) => patch({ e2: { ...state.e2, nom } })}
            />
          </div>
        </>
      ) : null}

      <TextField
        label="Personnes à charge"
        value={state.personnesACharge}
        onChange={(personnesACharge) => patch({ personnesACharge })}
        hint="Enfants ou autres personnes à charge — une seule saisie pour le foyer"
        placeholder="0"
      />
    </div>
  );
}
