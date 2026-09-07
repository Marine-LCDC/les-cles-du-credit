import {
  type SimulationInput,
  type RevenuProfessionnelInput,
  profilBesoinMaturite,
} from "@/lib/moteur";
import {
  parseNombreFr,
  type RevenuProForm,
  type WizardState,
} from "./wizard-state";

function mapRevenuPro(form: RevenuProForm): RevenuProfessionnelInput {
  const base: RevenuProfessionnelInput = {
    profil: form.profil,
  };

  const besoinMaturite = profilBesoinMaturite(form.profil);
  const maturite =
    besoinMaturite && form.maturiteActivite
      ? form.maturiteActivite
      : undefined;

  if (maturite) {
    base.maturiteActivite = maturite;
  }

  const useTrajectoire =
    besoinMaturite &&
    form.utiliserTrajectoire &&
    form.maturiteActivite === "trois_ans_ou_plus";

  if (useTrajectoire) {
    const n2 = parseNombreFr(form.nMoins2) ?? 0;
    const n1 = parseNombreFr(form.nMoins1) ?? 0;
    const n = parseNombreFr(form.n) ?? 0;
    return {
      ...base,
      trajectoireAnnuelle: { nMoins2: n2, nMoins1: n1, n },
    };
  }

  return {
    ...base,
    montantMensuel: parseNombreFr(form.montantMensuel) ?? 0,
  };
}

/**
 * Transforme l'état du wizard en entrée moteur.
 * Les champs identité (prénom/nom) ne sont pas envoyés au moteur.
 */
export function mapWizardToSimulation(state: WizardState): SimulationInput {
  const coEmprunt =
    state.coEmprunt || state.regime === "marie_communaute";

  const emprunteurs: SimulationInput["foyer"]["emprunteurs"] = [
    {
      id: "E1",
      revenusProfessionnels: [mapRevenuPro(state.revenuE1)],
    },
  ];

  if (coEmprunt) {
    emprunteurs.push({
      id: "E2",
      revenusProfessionnels: [mapRevenuPro(state.revenuE2)],
    });
  }

  const lignes = state.lignes
    .map((l) => ({
      type: l.type,
      montantMensuel: parseNombreFr(l.montantMensuel) ?? 0,
      attribution: l.attribution,
    }))
    .filter((l) => l.montantMensuel > 0);

  // Loyer attendu du bien locatif → revenu foncier foyer (décote appliquée par le moteur)
  if (
    state.typeProjet === "investissement_locatif" &&
    (parseNombreFr(state.loyerAttenduLocatif) ?? 0) > 0
  ) {
    lignes.push({
      type: "revenus_fonciers",
      montantMensuel: parseNombreFr(state.loyerAttenduLocatif)!,
      attribution: "foyer",
    });
  }

  const travaux = state.travauxNecessaires
    ? (parseNombreFr(state.travauxMontant) ?? 0)
    : 0;

  return {
    typeProjet: state.typeProjet,
    bien: {
      prixAcquisition: parseNombreFr(state.prixAcquisition) ?? 0,
      travaux,
      typeBien: state.typeBien,
      ...(parseNombreFr(state.fraisAcquisition) !== null
        ? { fraisAcquisitionEuros: parseNombreFr(state.fraisAcquisition)! }
        : {}),
    },
    foyer: {
      emprunteurs,
      personnesACharge: parseNombreFr(state.personnesACharge) ?? 0,
      logementActuel: {
        statut: state.statutLogement,
        chargeLogementMensuelle:
          state.statutLogement === "heberge"
            ? 0
            : (parseNombreFr(state.chargeLogementMensuelle) ?? 0),
        capitalRestantDu: parseNombreFr(state.capitalRestantDu) ?? undefined,
        prixVenteEstime: parseNombreFr(state.prixVenteEstime) ?? undefined,
        scenarioAncienBien: state.scenarioAncienBien || null,
        loyerRestantApresOperation:
          parseNombreFr(state.loyerRestantApresOperation) ?? undefined,
        loyerAttenduAncienBien:
          parseNombreFr(state.loyerAttenduAncienBien) ?? undefined,
      },
      liquidites: {
        epargneDisponible: parseNombreFr(state.epargneDisponible) ?? 0,
        epargneMensuelleMoyenne:
          parseNombreFr(state.epargneMensuelleMoyenne) ?? 0,
      },
      lignesDynamiques: lignes,
    },
    financement: {
      apport: parseNombreFr(state.apport) ?? 0,
      tauxNominalAnnuel: parseNombreFr(state.tauxNominal) ?? 0,
      tauxAssuranceAnnuel: parseNombreFr(state.tauxAssurance) ?? 0,
    },
    dureeMaxLocativeMarcheAnnees:
      state.typeProjet === "investissement_locatif"
        ? (parseNombreFr(state.dureeMaxLocative) ?? undefined)
        : undefined,
  };
}
