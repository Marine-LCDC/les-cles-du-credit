/**
 * Calcul des revenus retenus — revenu par revenu.
 * Source : 03-financial-engine.md §3, §4bis, §7.4.
 */

import type { ConstantesMoteur } from "./constantes";
import type {
  ClasseExploitabilite,
  EmprunteurInput,
  LigneDynamiqueInput,
  ProfilProfessionnel,
  RevenuAnalyse,
  RevenuProfessionnelInput,
  TrajectoireTriennale,
} from "./types";

export type OptionsRevenus = {
  /** Si true, exclut les revenus classe B et C (test déterminant §7.5). */
  exclureIncertains?: boolean;
};

function classeParDefaut(profil: ProfilProfessionnel): ClasseExploitabilite {
  switch (profil) {
    case "cdi_periode_essai":
      return "B";
    case "cdi_confirme":
    case "cdd_interim":
    case "portage_salarial":
    case "retraite":
    case "dirigeant_gerant_artisan":
    case "micro_vente":
    case "micro_prestation_bic":
    case "micro_liberal_bnc":
    case "liberal_ei_bnc":
    case "intermittent":
      return "A";
    default: {
      const _exhaustive: never = profil;
      return _exhaustive;
    }
  }
}

/**
 * Trajectoire triennale (§3) :
 * - stable ou hausse (N-2 ≤ N-1 ≤ N) → moyenne des 3
 * - baisse → retenir uniquement N
 */
export function appliquerTrajectoireTriennale(
  t: TrajectoireTriennale,
): { annuelRetenu: number; methode: string } {
  const { nMoins2, nMoins1, n } = t;
  const hausseOuStable = nMoins2 <= nMoins1 && nMoins1 <= n;
  if (hausseOuStable) {
    return {
      annuelRetenu: (nMoins2 + nMoins1 + n) / 3,
      methode: "trajectoire_hausse_ou_stable_moyenne",
    };
  }
  return {
    annuelRetenu: n,
    methode: "trajectoire_baisse_annee_N",
  };
}

function tauxMicro(
  profil: ProfilProfessionnel,
  c: ConstantesMoteur,
): number | null {
  switch (profil) {
    case "micro_vente":
      return c.tauxMicroVente;
    case "micro_prestation_bic":
      return c.tauxMicroPrestationBic;
    case "micro_liberal_bnc":
      return c.tauxMicroLiberalBnc;
    default:
      return null;
  }
}

function analyserRevenuPro(
  revenu: RevenuProfessionnelInput,
  attribution: "E1" | "E2",
  c: ConstantesMoteur,
  index: number,
): RevenuAnalyse {
  const classe = revenu.classeForcee ?? classeParDefaut(revenu.profil);
  const source = `${attribution}:${revenu.profil}#${index}`;

  if (classe === "C") {
    return {
      source,
      attribution,
      montantBrutMensuel: revenu.montantMensuel ?? 0,
      montantRetenuMensuel: 0,
      classe,
      methode: "non_exploitable_neutralise",
    };
  }

  // Profils à trajectoire / micro sur base annuelle
  if (revenu.trajectoireAnnuelle) {
    const { annuelRetenu, methode } = appliquerTrajectoireTriennale(
      revenu.trajectoireAnnuelle,
    );
    const taux = tauxMicro(revenu.profil, c);
    const apresTaux = taux !== null ? annuelRetenu * taux : annuelRetenu;
    return {
      source,
      attribution,
      montantBrutMensuel: annuelRetenu / 12,
      montantRetenuMensuel: apresTaux / 12,
      classe,
      methode: taux !== null ? `${methode}_puis_taux_${taux}` : methode,
    };
  }

  const mensuel = revenu.montantMensuel ?? 0;
  const taux = tauxMicro(revenu.profil, c);

  // Micro sans trajectoire : montantMensuel interprété comme CA mensuel brut
  if (taux !== null) {
    return {
      source,
      attribution,
      montantBrutMensuel: mensuel,
      montantRetenuMensuel: mensuel * taux,
      classe,
      methode: `taux_micro_${taux}`,
    };
  }

  // Retenue 100 % (CDI, CDD, portage, retraite, libéral, intermittent, dirigeant sans trajectoire)
  return {
    source,
    attribution,
    montantBrutMensuel: mensuel,
    montantRetenuMensuel: mensuel,
    classe,
    methode: "retenue_100pct",
  };
}

function analyserLigneDynamique(
  ligne: LigneDynamiqueInput,
  c: ConstantesMoteur,
  index: number,
): RevenuAnalyse | null {
  // Les charges ne sont pas des revenus — traitées ailleurs
  if (
    ligne.type === "pension_versee" ||
    ligne.type === "credit_conso" ||
    ligne.type === "credit_immobilier" ||
    ligne.type === "autre_charge"
  ) {
    return null;
  }

  const source = `ligne:${ligne.type}#${index}`;
  const attribution = ligne.attribution;

  if (ligne.type === "dividendes") {
    const classe = ligne.classeForcee ?? "A";
    return {
      source,
      attribution,
      montantBrutMensuel: ligne.montantMensuel,
      montantRetenuMensuel: ligne.montantMensuel * c.tauxRetenueDividendes,
      classe,
      methode: "dividendes_0pct",
    };
  }

  if (ligne.type === "revenus_fonciers") {
    const classe = ligne.classeForcee ?? "A";
    return {
      source,
      attribution,
      montantBrutMensuel: ligne.montantMensuel,
      montantRetenuMensuel: ligne.montantMensuel * c.coefficientLocatif,
      classe,
      methode: `coefficient_locatif_${c.coefficientLocatif}`,
    };
  }

  // rémunération_annexe, autre_revenu
  const classe =
    ligne.classeForcee ??
    (ligne.type === "autre_revenu" ? "B" : "A");
  return {
    source,
    attribution,
    montantBrutMensuel: ligne.montantMensuel,
    montantRetenuMensuel: ligne.montantMensuel,
    classe,
    methode:
      ligne.type === "autre_revenu"
        ? "autre_revenu_prudent"
        : "remuneration_annexe_100pct",
  };
}

export type AggregationRevenus = {
  revenusAnalyses: RevenuAnalyse[];
  totalRetenuMensuel: number;
  hasRevenusIncertains: boolean;
};

/**
 * Agrège revenus pro + lignes dynamiques de type revenu.
 * §4bis : somme E1 + E2 + foyer.
 */
export function aggreguerRevenusRetenus(
  emprunteurs: EmprunteurInput[],
  lignes: LigneDynamiqueInput[],
  c: ConstantesMoteur,
  options: OptionsRevenus = {},
): AggregationRevenus {
  const analyses: RevenuAnalyse[] = [];

  for (const emp of emprunteurs) {
    emp.revenusProfessionnels.forEach((rev, i) => {
      analyses.push(analyserRevenuPro(rev, emp.id, c, i));
    });
  }

  lignes.forEach((ligne, i) => {
    const a = analyserLigneDynamique(ligne, c, i);
    if (a) analyses.push(a);
  });

  const filtrés = options.exclureIncertains
    ? analyses.filter((a) => a.classe === "A")
    : analyses.filter((a) => a.classe !== "C");

  const totalRetenuMensuel = filtrés.reduce(
    (s, a) => s + a.montantRetenuMensuel,
    0,
  );

  const hasRevenusIncertains = analyses.some(
    (a) => a.classe === "B" || a.classe === "C",
  );

  return {
    revenusAnalyses: options.exclureIncertains ? filtrés : analyses,
    totalRetenuMensuel,
    hasRevenusIncertains,
  };
}

/** Somme des mensualités de crédits conservés (conso + immo dynamiques). */
export function totalCreditsConserves(
  lignes: LigneDynamiqueInput[],
): number {
  return lignes
    .filter(
      (l) => l.type === "credit_conso" || l.type === "credit_immobilier",
    )
    .reduce((s, l) => s + l.montantMensuel, 0);
}

/** Pensions + autres charges récurrentes. */
export function totalAutresCharges(
  lignes: LigneDynamiqueInput[],
): number {
  return lignes
    .filter(
      (l) => l.type === "pension_versee" || l.type === "autre_charge",
    )
    .reduce((s, l) => s + l.montantMensuel, 0);
}
