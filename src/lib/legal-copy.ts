/**
 * Textes légaux — source : mentions-legales + 05-compliance-legale.md
 * Libellés courts pour l'UI ; textes complets accessibles via « Voir le détail ».
 * À faire valider par un avocat.
 */

export const EMAIL_CONTACT_DPO = "contact@lesclesducredit.fr";

export const DUREE_CONSERVATION_TRIPTYQUE =
  "la durée de la mission de vente + 6 mois";

export const BANDEAU_RESULTAT =
  "Simulation indicative — ne vaut pas accord de prêt";

export const DISCLAIMER_INTRO = `Cette simulation est un outil d'estimation indicatif. Le résultat obtenu (mensualité, capacité d'emprunt, indication relative à la visite du bien référencé) est calculé à partir des informations que vous saisissez et de règles de calcul génériques (notamment les recommandations du Haut Conseil de Stabilité Financière). Il ne constitue :
- ni un accord de prêt, une offre de crédit ou un accord de principe bancaire ;
- ni un conseil en financement au sens réglementaire ;
- ni une garantie que votre dossier sera accepté par un établissement prêteur.

Seule une banque ou un courtier en crédit immobilier dûment habilité (immatriculé ORIAS) peut évaluer votre dossier de façon définitive et vous accorder un financement. Les Clés du Crédit n'est ni un établissement de crédit, ni un intermédiaire en opérations de banque et services de paiement (IOBSP), ni un courtier en crédit.`;

export const DISCLAIMER_CHECKBOX_LABEL =
  "J'ai compris que ce résultat est indicatif et non contractuel.";

/** Libellé court RGPD — le détail complet reste accessible avant validation. */
export const RGPD_CHECKBOX_LABEL =
  "J'accepte le traitement de mes données pour cette simulation, selon les conditions décrites.";

export function consentementRgpdDetail(): string {
  return `J'accepte que les informations financières que je renseigne (revenus, charges, apport, situation professionnelle) soient utilisées par Les Clés du Crédit le temps strictement nécessaire au calcul, sans être conservées au-delà. J'accepte en revanche que le résultat de cette simulation (indication relative à la visite, montants du bien et travaux concernés) ainsi que mon identité et la référence du bien soient conservés par Les Clés du Crédit et transmis à l'agence immobilière à l'origine de la demande, pendant ${DUREE_CONSERVATION_TRIPTYQUE}. Conformément au RGPD, je dispose d'un droit d'accès, de rectification et de suppression de ces informations en écrivant à ${EMAIL_CONTACT_DPO}.`;
}

/** @deprecated Utiliser consentementRgpdDetail() */
export function consentementRgpdLabel(): string {
  return consentementRgpdDetail();
}

export const MENTION_BAS_ECRAN =
  "Simulation réalisée à partir des informations que vous avez saisies, non vérifiées par un établissement bancaire. Vos données financières détaillées (revenus, charges) ne sont pas conservées.";

export function mentionFraisNotaire(
  typeBien: "ancien" | "neuf",
  tauxPct: number,
): string {
  const label = typeBien === "neuf" ? "neuf" : "ancien";
  const taux = tauxPct.toLocaleString("fr-FR", {
    minimumFractionDigits: tauxPct % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
  return `Le taux de frais de notaire appliqué correspond à une estimation (${label}, ${taux} %) et peut varier selon le bien et le département.`;
}

export const OPTIN_MARKETING_CHECKBOX_LABEL =
  "Je souhaite recevoir mon simulateur de crédit personnel offert par email.";

export const OPTIN_MARKETING_DETAIL =
  "Je souhaite recevoir par email mon simulateur de crédit personnel offert (calcul de mensualité et de capacité d'emprunt), ainsi que des informations sur les produits complémentaires proposés par Les Clés du Crédit (accès complet au simulateur, contenus pédagogiques). Je peux me désinscrire à tout moment via le lien présent dans chaque email.";

/** @deprecated Utiliser OPTIN_MARKETING_CHECKBOX_LABEL + OPTIN_MARKETING_DETAIL */
export const OPTIN_MARKETING_LABEL = OPTIN_MARKETING_DETAIL;

/** Disclaimer allégé pour le simulateur inversé (pas lié à une visite). */
export const DISCLAIMER_SIMULATEUR_CHECKBOX =
  "J'ai compris que ce calcul est indicatif et non contractuel.";
