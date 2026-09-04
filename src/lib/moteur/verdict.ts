/**
 * Arbre de décision + test déterminant (§6, §7.5).
 * Tous les indicateurs sont déjà calculés avant d'appeler ces fonctions.
 */

import type { ConstantesMoteur } from "./constantes";
import type {
  BadgeVerdict,
  IndicateursFinanciers,
  MotifVerdict,
  VerdictNiveau,
  VerdictResult,
} from "./types";

export function badgeDepuisNiveau(niveau: VerdictNiveau): BadgeVerdict {
  switch (niveau) {
    case "VERT":
      return "Visite recommandée";
    case "ORANGE":
      return "Visite possible";
    case "ROUGE":
      return "Visite peu conseillée";
    default: {
      const _exhaustive: never = niveau;
      return _exhaustive;
    }
  }
}

/**
 * Arbre §6 — appliqué à une simulation de référence déjà chiffrée.
 * Ne s'arrête pas au premier critère pour l'affichage pédagogique ;
 * ici on détermine uniquement le niveau.
 */
export function appliquerArbreDecision(
  ind: IndicateursFinanciers,
  c: ConstantesMoteur,
): VerdictResult {
  const motifs: MotifVerdict[] = [];

  // 1. Élimination RAV
  if (ind.rav < ind.ravSeuil) {
    motifs.push("rav_insuffisant");
    return {
      niveau: "ROUGE",
      badge: badgeDepuisNiveau("ROUGE"),
      motifs,
      plafonneParIncertitude: false,
    };
  }

  const effortOk = ind.tauxEffort <= c.plafondEffortHcsf;
  const sautMaitrise = ind.sautDeChargeMaitrise;

  // 2. Taux d'effort + saut
  if (effortOk && sautMaitrise) {
    motifs.push("effort_conforme_saut_maitrise");
    if (ind.sautDeCharge <= 0) motifs.push("saut_negatif_ou_nul");
    return {
      niveau: "VERT",
      badge: badgeDepuisNiveau("VERT"),
      motifs,
      plafonneParIncertitude: false,
    };
  }

  if (!effortOk && sautMaitrise) {
    motifs.push("effort_derogation_saut_maitrise");
    return {
      niveau: "ORANGE",
      badge: badgeDepuisNiveau("ORANGE"),
      motifs,
      plafonneParIncertitude: false,
    };
  }

  // 3. Filet épargne résiduelle (saut non maîtrisé)
  // Si saut ≤ 0 : filet non applicable — mais saut ≤ 0 implique déjà maîtrisé
  if (ind.sautDeCharge <= 0) {
    motifs.push("saut_negatif_ou_nul");
    return {
      niveau: effortOk ? "VERT" : "ORANGE",
      badge: badgeDepuisNiveau(effortOk ? "VERT" : "ORANGE"),
      motifs,
      plafonneParIncertitude: false,
    };
  }

  const couverture = ind.couvertureSautMois ?? 0;
  if (couverture >= c.filetCouvertureMois) {
    motifs.push("filet_epargne_ok");
    return {
      niveau: "ORANGE",
      badge: badgeDepuisNiveau("ORANGE"),
      motifs,
      plafonneParIncertitude: false,
    };
  }

  motifs.push("filet_epargne_insuffisant");
  return {
    niveau: "ROUGE",
    badge: badgeDepuisNiveau("ROUGE"),
    motifs,
    plafonneParIncertitude: false,
  };
}

function rang(niveau: VerdictNiveau): number {
  switch (niveau) {
    case "VERT":
      return 2;
    case "ORANGE":
      return 1;
    case "ROUGE":
      return 0;
  }
}

/**
 * Test déterminant §7.5 :
 * - Si dossier VERT sans revenus incertains → VERT (incertitude non déterminante)
 * - Si sans eux ROUGE, mais avec eux VERT/ORANGE → ORANGE
 * - Si non finançable même avec → ROUGE
 *
 * Ne peut jamais améliorer un verdict (ex. passer de ROUGE à VERT).
 */
export function appliquerTestDeterminant(
  verdictAvec: VerdictResult,
  verdictSansIncertains: VerdictResult,
): VerdictResult {
  if (!verdictAvec.plafonneParIncertitude) {
    // Comparaison pure
  }

  const avec = verdictAvec.niveau;
  const sans = verdictSansIncertains.niveau;

  // Incertitude non déterminante : reste VERT sans les revenus B/C
  if (sans === "VERT") {
    return {
      ...verdictAvec,
      niveau: "VERT",
      badge: badgeDepuisNiveau("VERT"),
      plafonneParIncertitude: false,
    };
  }

  // Finançabilité dépend d'un revenu à validation → plafond ORANGE
  if (sans === "ROUGE" && (avec === "VERT" || avec === "ORANGE")) {
    return {
      niveau: "ORANGE",
      badge: badgeDepuisNiveau("ORANGE"),
      motifs: [
        ...verdictAvec.motifs,
        "incertitude_revenu_determinante",
      ],
      plafonneParIncertitude: true,
    };
  }

  // Sans eux ORANGE, avec eux VERT → l'incertitude soutient le Vert → ORANGE max
  if (sans === "ORANGE" && avec === "VERT") {
    return {
      niveau: "ORANGE",
      badge: badgeDepuisNiveau("ORANGE"),
      motifs: [
        ...verdictAvec.motifs,
        "incertitude_revenu_determinante",
      ],
      plafonneParIncertitude: true,
    };
  }

  // Sinon conserver le plus défavorable des deux (prudence)
  const niveau = rang(avec) <= rang(sans) ? avec : sans;
  return {
    niveau,
    badge: badgeDepuisNiveau(niveau),
    motifs: verdictAvec.motifs,
    plafonneParIncertitude: niveau !== avec,
  };
}
