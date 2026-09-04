/**
 * Types d'entrée / sortie du moteur financier.
 * Alignés sur 03-financial-engine.md et perimetre-mvp.
 */

export type ProfilProfessionnel =
  | "cdi_confirme"
  | "cdi_periode_essai"
  | "cdd_interim"
  | "portage_salarial"
  | "retraite"
  | "dirigeant_gerant_artisan"
  | "micro_vente"
  | "micro_prestation_bic"
  | "micro_liberal_bnc"
  | "liberal_ei_bnc"
  | "intermittent";

/** Classe d'exploitabilité d'une source de revenu (§7.4). */
export type ClasseExploitabilite = "A" | "B" | "C";

export type TypeLigneDynamique =
  | "remuneration_annexe"
  | "dividendes"
  | "revenus_fonciers"
  | "pension_versee"
  | "credit_conso"
  | "credit_immobilier"
  | "autre_charge"
  | "autre_revenu";

export type AttributionLigne = "E1" | "E2" | "foyer";

export type TypeProjet =
  | "residence_principale"
  | "residence_secondaire"
  | "investissement_locatif";

export type TypeBien = "ancien" | "neuf";

export type StatutLogement = "locataire" | "proprietaire" | "heberge";

export type ScenarioAncienBien = "vente" | "location" | "indecis";

export type VerdictNiveau = "VERT" | "ORANGE" | "ROUGE";

export type BadgeVerdict =
  | "Visite recommandée"
  | "Visite possible"
  | "Visite peu conseillée";

/** Trois exercices annuels (montant de référence du profil : net, CA, etc.). */
export type TrajectoireTriennale = {
  nMoins2: number;
  nMoins1: number;
  n: number;
};

export type RevenuProfessionnelInput = {
  profil: ProfilProfessionnel;
  /**
   * Montant mensuel de référence (net imposable, pension, etc.)
   * pour les profils à retenue 100 % simple.
   */
  montantMensuel?: number;
  /**
   * CA / bénéfice annuel brut pour micro ou trajectoire dirigeants.
   * Si fourni pour un profil à trajectoire, prioritaire sur montantMensuel.
   */
  trajectoireAnnuelle?: TrajectoireTriennale;
  /**
   * Forcer la classe d'exploitabilité (sinon déduite du profil).
   * Classe C = revenus exclus du calcul.
   */
  classeForcee?: ClasseExploitabilite;
};

export type EmprunteurInput = {
  id: "E1" | "E2";
  revenusProfessionnels: RevenuProfessionnelInput[];
};

export type LigneDynamiqueInput = {
  type: TypeLigneDynamique;
  /** Montant mensuel */
  montantMensuel: number;
  attribution: AttributionLigne;
  /** Classe forcée pour revenus dynamiques incertains */
  classeForcee?: ClasseExploitabilite;
};

export type BienInput = {
  prixAcquisition: number;
  travaux: number;
  typeBien: TypeBien;
  /**
   * Montant € des frais d'acquisition fixé par l'agent.
   * Si omis → calcul auto (prix × taux selon typeBien).
   */
  fraisAcquisitionEuros?: number;
};

export type LogementActuelInput = {
  statut: StatutLogement;
  /** Loyer ou mensualité crédit actuel (€ / mois). 0 si hébergé. */
  chargeLogementMensuelle: number;
  /** Capital restant dû si propriétaire (pour produit net de vente). */
  capitalRestantDu?: number;
  /** Prix de vente estimé si scénario vente. */
  prixVenteEstime?: number;
  scenarioAncienBien?: ScenarioAncienBien | null;
  /**
   * Loyer restant effectivement à payer après l'opération
   * (ex. indécis / double charge partielle).
   */
  loyerRestantApresOperation?: number;
};

export type LiquiditesInput = {
  epargneDisponible: number;
  epargneMensuelleMoyenne: number;
};

export type FinancementInput = {
  apport: number;
  tauxNominalAnnuel: number;
  tauxAssuranceAnnuel: number;
  /**
   * Durée personnelle (années) pour personal_simulation uniquement.
   * Ignorée pour reference_simulation / agent_verdict.
   */
  dureePersonnelleAnnees?: number;
};

export type FoyerInput = {
  emprunteurs: EmprunteurInput[];
  personnesACharge: number;
  lignesDynamiques: LigneDynamiqueInput[];
  logementActuel: LogementActuelInput;
  liquidites: LiquiditesInput;
};

export type SimulationInput = {
  typeProjet: TypeProjet;
  bien: BienInput;
  foyer: FoyerInput;
  financement: FinancementInput;
  /**
   * Durée max locative marché (profil agence).
   * Obligatoire si typeProjet = investissement_locatif.
   */
  dureeMaxLocativeMarcheAnnees?: number;
};

/** Détail d'une source de revenu après analyse. */
export type RevenuAnalyse = {
  source: string;
  attribution: AttributionLigne | "E1" | "E2";
  montantBrutMensuel: number;
  montantRetenuMensuel: number;
  classe: ClasseExploitabilite;
  methode: string;
};

export type IndicateursFinanciers = {
  dureeReferenceAnnees: number;
  fraisAcquisition: number;
  coutProjet: number;
  apportRetenu: number;
  apportMaxDisponible: number;
  capitalEmprunte: number;
  mensualiteHorsAssurance: number;
  mensualiteAssurance: number;
  mensualiteTotale: number;
  revenusRetenusMensuels: number;
  chargesApresOperationMensuelles: number;
  creditsConservesMensuels: number;
  tauxEffort: number;
  rav: number;
  ravSeuil: number;
  chargeLogementActuelle: number;
  sautDeCharge: number;
  sautDeChargeMaitrise: boolean;
  epargneResiduelle: number;
  couvertureSautMois: number | null;
  capaciteEmpruntable: number;
  revenusAnalyses: RevenuAnalyse[];
};

export type MotifVerdict =
  | "rav_insuffisant"
  | "effort_conforme_saut_maitrise"
  | "effort_derogation_saut_maitrise"
  | "filet_epargne_ok"
  | "filet_epargne_insuffisant"
  | "incertitude_revenu_determinante"
  | "saut_negatif_ou_nul";

export type VerdictResult = {
  niveau: VerdictNiveau;
  badge: BadgeVerdict;
  motifs: MotifVerdict[];
  /** True si un plafond Orange a été appliqué via test déterminant §7.5 */
  plafonneParIncertitude: boolean;
};

export type ReferenceSimulation = {
  indicateurs: IndicateursFinanciers;
  agentVerdict: VerdictResult;
};

export type PersonalSimulation = {
  dureeAnnees: number;
  indicateurs: IndicateursFinanciers;
};

export type MoteurResult = {
  referenceSimulation: ReferenceSimulation;
  personalSimulation: PersonalSimulation | null;
};
