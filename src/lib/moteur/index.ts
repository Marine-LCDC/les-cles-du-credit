/**
 * Orchestrateur du moteur financier.
 * Produit reference_simulation (+ personal_simulation optionnelle).
 */

import {
  calculerIndicateurs,
  dureeReference,
} from "./calculs-globaux";
import {
  fusionnerConstantes,
  type ConstantesMoteur,
} from "./constantes";
import { aggreguerRevenusRetenus } from "./revenus-retenus";
import {
  appliquerArbreDecision,
  appliquerTestDeterminant,
} from "./verdict";
import type { MoteurResult, SimulationInput } from "./types";

export type { ConstantesMoteur };
export * from "./types";
export * from "./constantes";
export {
  appliquerTrajectoireTriennale,
  aggreguerRevenusRetenus,
} from "./revenus-retenus";
export {
  calculerIndicateurs,
  dureeReference,
  fraisAcquisitionEstimes,
  produitNetVente,
  seuilRav,
  estSautDeChargeMaitrise,
} from "./calculs-globaux";
export {
  appliquerArbreDecision,
  appliquerTestDeterminant,
  badgeDepuisNiveau,
} from "./verdict";

/**
 * Point d'entrée unique du moteur.
 * - Calcule tous les indicateurs sur durée de référence
 * - Applique l'arbre de décision
 * - Applique le test déterminant §7.5 si revenus incertains
 * - Calcule éventuellement personal_simulation (sans toucher au verdict agent)
 */
export function executerMoteur(
  input: SimulationInput,
  constantesOverrides?: Partial<ConstantesMoteur>,
): MoteurResult {
  const c = fusionnerConstantes(constantesOverrides);

  const indicateursAvec = calculerIndicateurs(input, c);
  const verdictAvec = appliquerArbreDecision(indicateursAvec, c);

  const { hasRevenusIncertains } = aggreguerRevenusRetenus(
    input.foyer.emprunteurs,
    input.foyer.lignesDynamiques,
    c,
  );

  let agentVerdict = verdictAvec;
  if (hasRevenusIncertains) {
    const indicateursSans = calculerIndicateurs(input, c, {
      exclureIncertains: true,
    });
    const verdictSans = appliquerArbreDecision(indicateursSans, c);
    agentVerdict = appliquerTestDeterminant(verdictAvec, verdictSans);
  }

  const referenceSimulation = {
    indicateurs: indicateursAvec,
    agentVerdict,
  };

  let personalSimulation: MoteurResult["personalSimulation"] = null;
  const dureePerso = input.financement.dureePersonnelleAnnees;
  const dureeRef = dureeReference(
    input.typeProjet,
    c,
    input.dureeMaxLocativeMarcheAnnees,
  );

  if (
    dureePerso !== undefined &&
    dureePerso > 0 &&
    dureePerso < dureeRef
  ) {
    personalSimulation = {
      dureeAnnees: dureePerso,
      indicateurs: calculerIndicateurs(input, c, {
        dureeForceeAnnees: dureePerso,
      }),
    };
  }

  return { referenceSimulation, personalSimulation };
}
