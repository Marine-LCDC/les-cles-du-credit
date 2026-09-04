"use client";

import { MoneyField, SelectField } from "../components/fields";
import {
  LIGNE_TYPE_OPTIONS,
  nouveauIdLigne,
  type LigneDynamiqueForm,
  type WizardState,
} from "../wizard-state";
import type { AttributionLigne, TypeLigneDynamique } from "@/lib/moteur";

type Props = {
  state: WizardState;
  patch: (p: Partial<WizardState>) => void;
};

export function StepLignes({ state, patch }: Props) {
  const showCo =
    state.coEmprunt || state.regime === "marie_communaute";

  const attributionOptions: { value: AttributionLigne; label: string }[] =
    showCo
      ? [
          { value: "E1", label: state.e1.prenom || "Emprunteur 1" },
          { value: "E2", label: state.e2.prenom || "Co-emprunteur" },
          { value: "foyer", label: "Le foyer" },
        ]
      : [
          { value: "E1", label: "Emprunteur" },
          { value: "foyer", label: "Le foyer" },
        ];

  function updateLigne(id: string, partial: Partial<LigneDynamiqueForm>) {
    patch({
      lignes: state.lignes.map((l) =>
        l.id === id ? { ...l, ...partial } : l,
      ),
    });
  }

  function addLigne() {
    patch({
      lignes: [
        ...state.lignes,
        {
          id: nouveauIdLigne(),
          type: "credit_conso",
          montantMensuel: "",
          attribution: "E1",
        },
      ],
    });
  }

  function removeLigne(id: string) {
    patch({ lignes: state.lignes.filter((l) => l.id !== id) });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral sm:text-2xl">
        Autres revenus et charges
      </h2>
      <p className="mt-2 mb-6 text-sm text-neutral-muted">
        Crédits en cours, loyers perçus, pensions… Ajoutez autant de lignes que
        nécessaire. Cette étape est facultative.
      </p>

      {state.lignes.length === 0 ? (
        <p className="mb-4 rounded-[12px] border border-dashed border-[#e6dcc8] bg-white/50 px-4 py-6 text-center text-sm text-neutral-muted">
          Aucune ligne pour l&apos;instant — vous pouvez continuer sans.
        </p>
      ) : null}

      {state.lignes.map((ligne, index) => (
        <div
          key={ligne.id}
          className="mb-4 rounded-[16px] border border-[#e6dcc8] bg-white/70 p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral">
              Ligne {index + 1}
            </p>
            <button
              type="button"
              onClick={() => removeLigne(ligne.id)}
              className="min-h-9 text-sm text-status-red underline-offset-2 hover:underline"
            >
              Retirer
            </button>
          </div>

          <SelectField<TypeLigneDynamique>
            label="Type"
            value={ligne.type}
            onChange={(type) => updateLigne(ligne.id, { type })}
            options={LIGNE_TYPE_OPTIONS}
          />

          <MoneyField
            label="Montant mensuel"
            value={ligne.montantMensuel}
            onChange={(montantMensuel) =>
              updateLigne(ligne.id, { montantMensuel })
            }
          />

          <SelectField<AttributionLigne>
            label="Attribution"
            value={ligne.attribution}
            onChange={(attribution) => updateLigne(ligne.id, { attribution })}
            options={attributionOptions}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addLigne}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[12px] border border-brand/40 bg-brand-light px-4 text-sm font-medium text-brand transition-colors hover:bg-[#d5ebe4]"
      >
        Ajouter une ligne
      </button>
    </div>
  );
}
