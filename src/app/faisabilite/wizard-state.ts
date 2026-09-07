/**
 * État du wizard faisabilité (Phase 1.4) — formulaire client standalone.
 * Mappé vers SimulationInput via map-to-moteur.ts.
 */

import type {
  AttributionLigne,
  MaturiteActivite,
  ProfilProfessionnel,
  ScenarioAncienBien,
  StatutLogement,
  TypeBien,
  TypeLigneDynamique,
  TypeProjet,
} from "@/lib/moteur";
import { profilBesoinMaturite } from "@/lib/moteur";

export const TOTAL_ETAPES = 7;

export const ETAPE_LABELS = [
  "Projet",
  "Foyer",
  "Profession",
  "Logement",
  "Charges & revenus",
  "Épargne",
  "Financement",
] as const;

export type RegimeMatrimonial =
  | "celibataire"
  | "marie_separation"
  | "marie_communaute"
  | "pacse"
  | "divorce"
  | "veuf";

export type IdentiteEmprunteur = {
  prenom: string;
  nom: string;
};

export type RevenuProForm = {
  profil: ProfilProfessionnel;
  /** Net / pension / CA mensuel moyen selon profil (§3.2) */
  montantMensuel: string;
  /** Maturité d'activité — profils indépendants / micro / libéral */
  maturiteActivite: MaturiteActivite | "";
  /** Optionnel : raffiner avec les 3 exercices (si maturité ≥ 3 ans) */
  utiliserTrajectoire: boolean;
  nMoins2: string;
  nMoins1: string;
  n: string;
};

export type LigneDynamiqueForm = {
  id: string;
  type: TypeLigneDynamique;
  montantMensuel: string;
  attribution: AttributionLigne;
};

export type WizardState = {
  // Étape 1 — Projet
  typeProjet: TypeProjet;
  ville: string;
  referenceBien: string;
  prixAcquisition: string;
  typeBien: TypeBien;
  travauxNecessaires: boolean;
  travauxMontant: string;
  loyerAttenduLocatif: string;
  dureeMaxLocative: string;

  // Étape 2 — Foyer
  coEmprunt: boolean;
  e1: IdentiteEmprunteur;
  e2: IdentiteEmprunteur;
  regime: RegimeMatrimonial;
  personnesACharge: string;

  // Étape 3 — Profession
  revenuE1: RevenuProForm;
  revenuE2: RevenuProForm;

  // Étape 4 — Logement
  statutLogement: StatutLogement;
  chargeLogementMensuelle: string;
  capitalRestantDu: string;
  scenarioAncienBien: ScenarioAncienBien | "";
  prixVenteEstime: string;
  /** Loyer encore à payer (scénario indécis / double charge). */
  loyerRestantApresOperation: string;
  /** Loyer attendu si l'ancien bien est mis en location. */
  loyerAttenduAncienBien: string;

  // Étape 5 — Lignes dynamiques
  lignes: LigneDynamiqueForm[];

  // Étape 6 — Liquidités
  epargneDisponible: string;
  epargneMensuelleMoyenne: string;

  // Étape 7 — Financement
  apport: string;
  tauxNominal: string;
  tauxAssurance: string;
};

export function revenuProInitial(): RevenuProForm {
  return {
    profil: "cdi_confirme",
    montantMensuel: "",
    maturiteActivite: "",
    utiliserTrajectoire: false,
    nMoins2: "",
    nMoins1: "",
    n: "",
  };
}

export function etatInitial(): WizardState {
  return {
    typeProjet: "residence_principale",
    ville: "",
    referenceBien: "",
    prixAcquisition: "",
    typeBien: "ancien",
    travauxNecessaires: false,
    travauxMontant: "",
    loyerAttenduLocatif: "",
    dureeMaxLocative: "20",

    coEmprunt: false,
    e1: { prenom: "", nom: "" },
    e2: { prenom: "", nom: "" },
    regime: "celibataire",
    personnesACharge: "0",

    revenuE1: revenuProInitial(),
    revenuE2: revenuProInitial(),

    statutLogement: "locataire",
    chargeLogementMensuelle: "",
    capitalRestantDu: "",
    scenarioAncienBien: "",
    prixVenteEstime: "",
    loyerRestantApresOperation: "",
    loyerAttenduAncienBien: "",

    lignes: [],

    epargneDisponible: "",
    epargneMensuelleMoyenne: "",

    apport: "",
    tauxNominal: "3,50",
    tauxAssurance: "0,34",
  };
}

export const PROFIL_OPTIONS: { value: ProfilProfessionnel; label: string }[] = [
  { value: "cdi_confirme", label: "CDI confirmé" },
  { value: "cdi_periode_essai", label: "CDI en période d'essai" },
  { value: "cdd_interim", label: "CDD / Intérim" },
  { value: "portage_salarial", label: "Portage salarial" },
  { value: "retraite", label: "Retraité" },
  { value: "dirigeant_gerant_artisan", label: "Dirigeant / Gérant / Artisan" },
  { value: "micro_vente", label: "Micro-entreprise — vente" },
  { value: "micro_prestation_bic", label: "Micro-entreprise — prestation (BIC)" },
  { value: "micro_liberal_bnc", label: "Micro-entreprise — libéral (BNC)" },
  { value: "liberal_ei_bnc", label: "Profession libérale (EI / BNC)" },
  { value: "intermittent", label: "Intermittent" },
];

export const LIGNE_TYPE_OPTIONS: {
  value: TypeLigneDynamique;
  label: string;
}[] = [
  { value: "remuneration_annexe", label: "Rémunération annexe" },
  { value: "dividendes", label: "Dividendes" },
  { value: "revenus_fonciers", label: "Revenus fonciers / locatifs" },
  { value: "pension_versee", label: "Pension alimentaire versée" },
  { value: "credit_conso", label: "Crédit consommation" },
  { value: "credit_immobilier", label: "Crédit immobilier en cours" },
  { value: "autre_charge", label: "Autre charge" },
  { value: "autre_revenu", label: "Autre revenu" },
];

export function parseNombreFr(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export const MATURITE_OPTIONS: {
  value: MaturiteActivite;
  label: string;
}[] = [
  { value: "moins_1_an", label: "Moins d'1 an" },
  { value: "un_a_deux_ans", label: "1 à 2 ans" },
  { value: "trois_ans_ou_plus", label: "3 ans ou plus" },
];

/** @deprecated Préférer profilBesoinMaturite — la trajectoire est optionnelle. */
export function profilBesoinTrajectoire(profil: ProfilProfessionnel): boolean {
  return profilBesoinMaturite(profil);
}

export { profilBesoinMaturite };

export function nouveauIdLigne(): string {
  return `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
