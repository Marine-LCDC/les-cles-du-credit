/**
 * Calculs globaux : projet, mensualité, RAV, effort, saut, filet.
 * Source : 03-financial-engine.md §2, §4, §5, §5bis, §6.
 */

import {
  buildResult,
  capitalDepuisMensualiteTotale,
} from "../credit-math";
import type { ConstantesMoteur } from "./constantes";
import {
  aggreguerRevenusRetenus,
  totalAutresCharges,
  totalCreditsConserves,
  type OptionsRevenus,
} from "./revenus-retenus";
import type {
  BienInput,
  FoyerInput,
  IndicateursFinanciers,
  LogementActuelInput,
  SimulationInput,
  TypeProjet,
} from "./types";

export function dureeReference(
  typeProjet: TypeProjet,
  c: ConstantesMoteur,
  dureeMaxLocativeMarcheAnnees?: number,
): number {
  if (typeProjet === "investissement_locatif") {
    const marche =
      dureeMaxLocativeMarcheAnnees ?? c.dureeReferenceResidenceAnnees;
    return Math.min(c.dureeMaxReglementaireAnnees, marche);
  }
  return c.dureeReferenceResidenceAnnees;
}

export function fraisAcquisitionEstimes(
  bien: BienInput,
  c: ConstantesMoteur,
): number {
  if (bien.fraisAcquisitionEuros !== undefined) {
    return bien.fraisAcquisitionEuros;
  }
  const taux =
    bien.typeBien === "neuf"
      ? c.tauxFraisAcquisitionNeuf
      : c.tauxFraisAcquisitionAncien;
  // Base = prix uniquement, pas prix + travaux (§2ter)
  return bien.prixAcquisition * taux;
}

/**
 * Produit net de vente (§5) :
 * max(0, prixVente × (1 − 7 %) − capitalRestantDû)
 */
export function produitNetVente(
  logement: LogementActuelInput,
  c: ConstantesMoteur,
): number {
  if (logement.scenarioAncienBien !== "vente") return 0;
  const prix = logement.prixVenteEstime ?? 0;
  const crd = logement.capitalRestantDu ?? 0;
  return Math.max(0, prix * (1 - c.margeFraisRevente) - crd);
}

export function apportMaxDisponible(
  foyer: FoyerInput,
  c: ConstantesMoteur,
): number {
  const epargne = foyer.liquidites.epargneDisponible;
  if (foyer.logementActuel.scenarioAncienBien === "vente") {
    return epargne + produitNetVente(foyer.logementActuel, c);
  }
  return epargne;
}

export function seuilRav(
  nombreEmprunteurs: number,
  personnesACharge: number,
  c: ConstantesMoteur,
): number {
  const base =
    nombreEmprunteurs >= 2
      ? c.ravSeuil2Emprunteurs
      : c.ravSeuil1Emprunteur;
  return base + personnesACharge * c.ravSeuilParPersonneACharge;
}

export function chargeLogementActuelle(
  logement: LogementActuelInput,
): number {
  if (logement.statut === "heberge") return 0;
  return logement.chargeLogementMensuelle;
}

/**
 * Saut de charge maîtrisé (§5) si AU MOINS une condition :
 * 1. RAV ≥ seuil + saut
 * 2. Épargne mensuelle moyenne ≥ saut
 */
export function estSautDeChargeMaitrise(
  rav: number,
  ravSeuil: number,
  sautDeCharge: number,
  epargneMensuelleMoyenne: number,
): boolean {
  if (sautDeCharge <= 0) return true;
  const cond1 = rav >= ravSeuil + sautDeCharge;
  const cond2 = epargneMensuelleMoyenne >= sautDeCharge;
  return cond1 || cond2;
}

/**
 * Couverture du saut par l'épargne résiduelle (mois).
 * null si saut ≤ 0 (test non applicable).
 */
export function couvertureSautMois(
  epargneResiduelle: number,
  sautDeCharge: number,
): number | null {
  if (sautDeCharge <= 0) return null;
  return epargneResiduelle / sautDeCharge;
}

export type CalculIndicateursOptions = OptionsRevenus & {
  /** Durée forcée (personal_simulation). Sinon durée de référence. */
  dureeForceeAnnees?: number;
};

export function calculerIndicateurs(
  input: SimulationInput,
  c: ConstantesMoteur,
  options: CalculIndicateursOptions = {},
): IndicateursFinanciers {
  const duree =
    options.dureeForceeAnnees ??
    dureeReference(
      input.typeProjet,
      c,
      input.dureeMaxLocativeMarcheAnnees,
    );

  const frais = fraisAcquisitionEstimes(input.bien, c);
  const coutProjet =
    input.bien.prixAcquisition + input.bien.travaux + frais;

  const apportMax = apportMaxDisponible(input.foyer, c);
  const apportRetenu = Math.min(
    Math.max(0, input.financement.apport),
    coutProjet,
    apportMax,
  );
  const capitalEmprunte = Math.max(0, coutProjet - apportRetenu);

  const credit = buildResult({
    capital: capitalEmprunte,
    tauxAnnuel: input.financement.tauxNominalAnnuel,
    dureeAnnees: duree,
    tauxAssuranceAnnuel: input.financement.tauxAssuranceAnnuel,
  });

  const revenus = aggreguerRevenusRetenus(
    input.foyer.emprunteurs,
    input.foyer.lignesDynamiques,
    c,
    { exclureIncertains: options.exclureIncertains },
  );

  const creditsConserves = totalCreditsConserves(
    input.foyer.lignesDynamiques,
  );
  const autresCharges = totalAutresCharges(input.foyer.lignesDynamiques);
  const loyerRestant =
    input.foyer.logementActuel.loyerRestantApresOperation ?? 0;

  // Charges après opération (§4)
  const chargesApres =
    credit.mensualiteTotale +
    creditsConserves +
    autresCharges +
    loyerRestant;

  const rav = revenus.totalRetenuMensuel - chargesApres;
  const ravSeuilValue = seuilRav(
    input.foyer.emprunteurs.length,
    input.foyer.personnesACharge,
    c,
  );

  // Taux d'effort HCSF (§2bis) — loyers JAMAIS en réduction du numérateur
  const numerateurEffort = credit.mensualiteTotale + creditsConserves;
  const tauxEffort =
    revenus.totalRetenuMensuel > 0
      ? numerateurEffort / revenus.totalRetenuMensuel
      : Number.POSITIVE_INFINITY;

  const chargeActuelle = chargeLogementActuelle(
    input.foyer.logementActuel,
  );
  // Nouvelle charge logement = nouvelle mensualité (crédits conso restent hors saut « logement »)
  // Spec : sautDeCharge = nouvelleMensualitéTotale − chargeLogementActuelle
  const saut = credit.mensualiteTotale - chargeActuelle;

  const sautMaitrise = estSautDeChargeMaitrise(
    rav,
    ravSeuilValue,
    saut,
    input.foyer.liquidites.epargneMensuelleMoyenne,
  );

  const epargneResiduelle = Math.max(
    0,
    input.foyer.liquidites.epargneDisponible - apportRetenu,
  );
  // Si scénario vente : l'apport peut inclure le produit net ; l'épargne résiduelle
  // porte sur l'épargne mobilisable avant projet − apport consommé.
  // On utilise epargneDisponible seule comme base « liquidités restantes »
  // lorsque l'apport dépasse l'épargne (partie financée par produit net).
  const epargneResiduelleAjustee =
    apportRetenu > input.foyer.liquidites.epargneDisponible
      ? 0
      : epargneResiduelle;

  const couverture = couvertureSautMois(epargneResiduelleAjustee, saut);

  // Capacité empruntable à 35 % d'effort (assurance comprise, crédits conservés déduits)
  const capaciteMensuelleMax = Math.max(
    0,
    revenus.totalRetenuMensuel * c.plafondEffortHcsf - creditsConserves,
  );
  const capaciteEmpruntable =
    capaciteMensuelleMax > 0
      ? capitalDepuisMensualiteTotale(
          capaciteMensuelleMax,
          input.financement.tauxNominalAnnuel,
          duree,
          input.financement.tauxAssuranceAnnuel,
        )
      : 0;

  return {
    dureeReferenceAnnees: duree,
    fraisAcquisition: frais,
    coutProjet,
    apportRetenu,
    apportMaxDisponible: apportMax,
    capitalEmprunte,
    mensualiteHorsAssurance: credit.mensualiteHorsAssurance,
    mensualiteAssurance: credit.mensualiteAssurance,
    mensualiteTotale: credit.mensualiteTotale,
    revenusRetenusMensuels: revenus.totalRetenuMensuel,
    chargesApresOperationMensuelles: chargesApres,
    creditsConservesMensuels: creditsConserves,
    tauxEffort,
    rav,
    ravSeuil: ravSeuilValue,
    chargeLogementActuelle: chargeActuelle,
    sautDeCharge: saut,
    sautDeChargeMaitrise: sautMaitrise,
    epargneResiduelle: epargneResiduelleAjustee,
    couvertureSautMois: couverture,
    capaciteEmpruntable,
    revenusAnalyses: revenus.revenusAnalyses,
  };
}
