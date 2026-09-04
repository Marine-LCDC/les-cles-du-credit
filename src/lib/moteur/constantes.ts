/**
 * Constantes financières configurables — source : 03-financial-engine.md §2, §4, §5bis, §6.
 * Ne jamais hardcoder ces valeurs ailleurs dans le moteur.
 */

/** Plafond d'effort HCSF (référence réglementaire). Tag: HCSF */
export const PLAFOND_EFFORT_HCSF = 0.35;

/** Frais d'acquisition estimés MVP — ancien. Tag: ENGINE_PRUDENTIAL_RULE */
export const TAUX_FRAIS_ACQUISITION_ANCIEN = 0.075;

/** Frais d'acquisition estimés MVP — neuf / VEFA. Tag: ENGINE_PRUDENTIAL_RULE */
export const TAUX_FRAIS_ACQUISITION_NEUF = 0.025;

/**
 * Coefficient locatif (hypothèse bancaire prudente, paramétrable).
 * Tag: ENGINE_PRUDENTIAL_RULE — pas une norme légale HCSF.
 */
export const COEFFICIENT_LOCATIF_DEFAUT = 0.7;

/** Dividendes : 0 % retenus (−100 %). Tag: ENGINE_PRUDENTIAL_RULE */
export const TAUX_RETENUE_DIVIDENDES = 0;

/** Marge de frais de revente pour produit net. Tag: ENGINE_PRUDENTIAL_RULE */
export const MARGE_FRAIS_REVENTE = 0.07;

/** Durée de référence RP / RS (années). Tag: ENGINE_PRUDENTIAL_RULE */
export const DUREE_REFERENCE_RESIDENCE_ANNEES = 25;

/** Plafond réglementaire durée prêt (années) — paramètre moteur. */
export const DUREE_MAX_REGLEMENTAIRE_ANNEES = 25;

/** Seuils RAV prudentiels indicatifs. Tag: ENGINE_PRUDENTIAL_RULE */
export const RAV_SEUIL_1_EMPRUNTEUR = 800;
export const RAV_SEUIL_2_EMPRUNTEURS = 1200;
export const RAV_SEUIL_PAR_PERSONNE_A_CHARGE = 300;

/** Filet épargne résiduelle (mois de couverture). Tag: ENGINE_PRUDENTIAL_RULE */
export const FILET_COUVERTURE_MOIS = 60;

/** Taux de retenue micro-entreprise sur CA brut. Tag: ENGINE_PRUDENTIAL_RULE */
export const TAUX_MICRO_VENTE = 0.29;
export const TAUX_MICRO_PRESTATION_BIC = 0.5;
export const TAUX_MICRO_LIBERAL_BNC = 0.66;

export type ConstantesMoteur = {
  plafondEffortHcsf: number;
  tauxFraisAcquisitionAncien: number;
  tauxFraisAcquisitionNeuf: number;
  coefficientLocatif: number;
  tauxRetenueDividendes: number;
  margeFraisRevente: number;
  dureeReferenceResidenceAnnees: number;
  dureeMaxReglementaireAnnees: number;
  ravSeuil1Emprunteur: number;
  ravSeuil2Emprunteurs: number;
  ravSeuilParPersonneACharge: number;
  filetCouvertureMois: number;
  tauxMicroVente: number;
  tauxMicroPrestationBic: number;
  tauxMicroLiberalBnc: number;
};

export const CONSTANTES_DEFAUT: ConstantesMoteur = {
  plafondEffortHcsf: PLAFOND_EFFORT_HCSF,
  tauxFraisAcquisitionAncien: TAUX_FRAIS_ACQUISITION_ANCIEN,
  tauxFraisAcquisitionNeuf: TAUX_FRAIS_ACQUISITION_NEUF,
  coefficientLocatif: COEFFICIENT_LOCATIF_DEFAUT,
  tauxRetenueDividendes: TAUX_RETENUE_DIVIDENDES,
  margeFraisRevente: MARGE_FRAIS_REVENTE,
  dureeReferenceResidenceAnnees: DUREE_REFERENCE_RESIDENCE_ANNEES,
  dureeMaxReglementaireAnnees: DUREE_MAX_REGLEMENTAIRE_ANNEES,
  ravSeuil1Emprunteur: RAV_SEUIL_1_EMPRUNTEUR,
  ravSeuil2Emprunteurs: RAV_SEUIL_2_EMPRUNTEURS,
  ravSeuilParPersonneACharge: RAV_SEUIL_PAR_PERSONNE_A_CHARGE,
  filetCouvertureMois: FILET_COUVERTURE_MOIS,
  tauxMicroVente: TAUX_MICRO_VENTE,
  tauxMicroPrestationBic: TAUX_MICRO_PRESTATION_BIC,
  tauxMicroLiberalBnc: TAUX_MICRO_LIBERAL_BNC,
};

export function fusionnerConstantes(
  overrides?: Partial<ConstantesMoteur>,
): ConstantesMoteur {
  return { ...CONSTANTES_DEFAUT, ...overrides };
}
