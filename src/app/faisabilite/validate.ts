/**
 * Validation légère par étape — messages conformes au guide copywriting.
 */

import {
  parseNombreFr,
  type RevenuProForm,
  type WizardState,
} from "./wizard-state";

function requisNombre(raw: string, label: string): string | null {
  const n = parseNombreFr(raw);
  if (n === null) return `Il manque encore ${label}`;
  return null;
}

function validerRevenu(rev: RevenuProForm, qui: string): string | null {
  const dirigeant = rev.profil === "dirigeant_gerant_artisan";
  const useTraj = dirigeant || rev.utiliserTrajectoire;

  if (useTraj) {
    if (
      parseNombreFr(rev.nMoins2) === null ||
      parseNombreFr(rev.nMoins1) === null ||
      parseNombreFr(rev.n) === null
    ) {
      return `Il manque encore les 3 exercices pour ${qui}`;
    }
    return null;
  }

  return requisNombre(rev.montantMensuel, `le revenu de ${qui}`);
}

export function validerEtape(
  etape: number,
  state: WizardState,
): string | null {
  switch (etape) {
    case 1: {
      if (!state.ville.trim()) return "Il manque encore la ville du bien";
      const prix = requisNombre(state.prixAcquisition, "le prix d'acquisition");
      if (prix) return prix;
      if (state.travauxNecessaires) {
        const t = requisNombre(state.travauxMontant, "le montant des travaux");
        if (t) return t;
      }
      if (state.typeProjet === "investissement_locatif") {
        const d = requisNombre(
          state.dureeMaxLocative,
          "la durée max. habituelle pour un locatif",
        );
        if (d) return d;
      }
      return null;
    }
    case 2: {
      if (!state.e1.prenom.trim() || !state.e1.nom.trim()) {
        return "Il manque encore votre prénom et nom";
      }
      const forceCo = state.regime === "marie_communaute";
      if ((state.coEmprunt || forceCo) && (!state.e2.prenom.trim() || !state.e2.nom.trim())) {
        return "Il manque encore l'identité du co-emprunteur";
      }
      if (parseNombreFr(state.personnesACharge) === null) {
        return "Il manque encore le nombre de personnes à charge";
      }
      return null;
    }
    case 3: {
      const e1 = validerRevenu(state.revenuE1, "l'emprunteur");
      if (e1) return e1;
      const co =
        state.coEmprunt || state.regime === "marie_communaute";
      if (co) {
        const e2 = validerRevenu(state.revenuE2, "le co-emprunteur");
        if (e2) return e2;
      }
      return null;
    }
    case 4: {
      if (state.statutLogement !== "heberge") {
        const c = requisNombre(
          state.chargeLogementMensuelle,
          state.statutLogement === "locataire"
            ? "votre loyer actuel"
            : "votre mensualité de crédit actuelle",
        );
        if (c) return c;
      }
      if (state.statutLogement === "proprietaire") {
        if (!state.scenarioAncienBien) {
          return "Il manque encore le projet pour votre logement actuel";
        }
        if (state.scenarioAncienBien === "vente") {
          const p = requisNombre(
            state.prixVenteEstime,
            "le prix de vente estimé",
          );
          if (p) return p;
        }
      }
      return null;
    }
    case 5:
      // Lignes optionnelles — valider montants si ligne présente
      for (const l of state.lignes) {
        if (l.montantMensuel.trim() && parseNombreFr(l.montantMensuel) === null) {
          return "Un montant de ligne complémentaire est invalide";
        }
      }
      return null;
    case 6: {
      const e = requisNombre(state.epargneDisponible, "votre épargne disponible");
      if (e) return e;
      return requisNombre(
        state.epargneMensuelleMoyenne,
        "votre épargne mensuelle moyenne",
      );
    }
    case 7: {
      const a = requisNombre(state.apport, "votre apport");
      if (a) return a;
      const t = requisNombre(state.tauxNominal, "le taux nominal");
      if (t) return t;
      return requisNombre(state.tauxAssurance, "le taux d'assurance");
    }
    default:
      return null;
  }
}
