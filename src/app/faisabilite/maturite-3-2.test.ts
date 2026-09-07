/**
 * Vérification §3.2 — maturité + moyenne (wizard → moteur → verdict).
 * Couvre les cas métier de la simplification « moyenne seule ».
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  aggreguerRevenusRetenus,
  CONSTANTES_DEFAUT,
  executerMoteur,
  type MaturiteActivite,
  type SimulationInput,
} from "../../lib/moteur";
import { mapWizardToSimulation } from "./map-to-moteur";
import { validerEtape } from "./validate";
import {
  etatInitial,
  type RevenuProForm,
  type WizardState,
} from "./wizard-state";

function revenuIndependant(
  overrides: Partial<RevenuProForm> & Pick<RevenuProForm, "profil">,
): RevenuProForm {
  return {
    profil: overrides.profil,
    montantMensuel: overrides.montantMensuel ?? "4000",
    maturiteActivite: overrides.maturiteActivite ?? "trois_ans_ou_plus",
    utiliserTrajectoire: overrides.utiliserTrajectoire ?? false,
    nMoins2: overrides.nMoins2 ?? "",
    nMoins1: overrides.nMoins1 ?? "",
    n: overrides.n ?? "",
  };
}

/** Wizard minimal prêt à simuler (étapes 1–7 renseignées). */
function wizardPret(patch: Partial<WizardState> = {}): WizardState {
  return {
    ...etatInitial(),
    ville: "Lyon",
    prixAcquisition: "220000",
    e1: { prenom: "Alice", nom: "Martin" },
    personnesACharge: "0",
    revenuE1: revenuIndependant({
      profil: "dirigeant_gerant_artisan",
      montantMensuel: "4000",
      maturiteActivite: "trois_ans_ou_plus",
    }),
    chargeLogementMensuelle: "900",
    epargneDisponible: "60000",
    epargneMensuelleMoyenne: "400",
    apport: "50000",
    ...patch,
  };
}

function simulationDirigeant(
  maturite: MaturiteActivite,
  montantMensuel: number,
  extras: Partial<SimulationInput["foyer"]> = {},
): SimulationInput {
  return {
    typeProjet: "residence_principale",
    bien: {
      prixAcquisition: 220_000,
      travaux: 0,
      typeBien: "ancien",
    },
    foyer: {
      emprunteurs: [
        {
          id: "E1",
          revenusProfessionnels: [
            {
              profil: "dirigeant_gerant_artisan",
              montantMensuel,
              maturiteActivite: maturite,
            },
          ],
        },
      ],
      personnesACharge: 0,
      logementActuel: {
        statut: "locataire",
        chargeLogementMensuelle: 900,
      },
      liquidites: {
        epargneDisponible: 60_000,
        epargneMensuelleMoyenne: 400,
      },
      lignesDynamiques: [],
      ...extras,
    },
    financement: {
      apport: 50_000,
      tauxNominalAnnuel: 3.5,
      tauxAssuranceAnnuel: 0.34,
    },
  };
}

describe("§3.2 — validation wizard maturité", () => {
  it("refuse un indépendant sans ancienneté renseignée", () => {
    const state = wizardPret({
      revenuE1: revenuIndependant({
        profil: "micro_vente",
        maturiteActivite: "",
        montantMensuel: "8000",
      }),
    });
    const err = validerEtape(3, state);
    assert.ok(err);
    assert.match(err!, /ancienneté/i);
  });

  it("accepte moyenne seule si maturité renseignée (sans 3 exercices)", () => {
    const state = wizardPret({
      revenuE1: revenuIndependant({
        profil: "dirigeant_gerant_artisan",
        maturiteActivite: "un_a_deux_ans",
        montantMensuel: "3500",
        utiliserTrajectoire: false,
      }),
    });
    assert.equal(validerEtape(3, state), null);
  });

  it("exige les 3 exercices seulement si toggle trajectoire + ≥ 3 ans", () => {
    const incomplet = wizardPret({
      revenuE1: revenuIndependant({
        profil: "dirigeant_gerant_artisan",
        maturiteActivite: "trois_ans_ou_plus",
        utiliserTrajectoire: true,
        nMoins2: "",
        nMoins1: "40000",
        n: "45000",
      }),
    });
    assert.match(validerEtape(3, incomplet)!, /3 exercices/);

    const complet = wizardPret({
      revenuE1: revenuIndependant({
        profil: "dirigeant_gerant_artisan",
        maturiteActivite: "trois_ans_ou_plus",
        utiliserTrajectoire: true,
        nMoins2: "36000",
        nMoins1: "40000",
        n: "45000",
      }),
    });
    assert.equal(validerEtape(3, complet), null);
  });

  it("CDI confirmé : pas d'exigence de maturité", () => {
    const state = wizardPret({
      revenuE1: {
        ...revenuIndependant({ profil: "cdi_confirme" }),
        maturiteActivite: "",
        montantMensuel: "2800",
      },
    });
    assert.equal(validerEtape(3, state), null);
  });
});

describe("§3.2 — mapping wizard → moteur", () => {
  it("moyenne + maturité < 3 ans → montantMensuel + maturite, pas de trajectoire fictive", () => {
    const input = mapWizardToSimulation(
      wizardPret({
        revenuE1: revenuIndependant({
          profil: "micro_prestation_bic",
          maturiteActivite: "moins_1_an",
          montantMensuel: "8000",
          utiliserTrajectoire: true, // ignoré si < 3 ans
          nMoins2: "0",
          nMoins1: "0",
          n: "90000",
        }),
      }),
    );
    const rev = input.foyer.emprunteurs[0]!.revenusProfessionnels[0]!;
    assert.equal(rev.maturiteActivite, "moins_1_an");
    assert.equal(rev.montantMensuel, 8_000);
    assert.equal(rev.trajectoireAnnuelle, undefined);
  });

  it("≥ 3 ans + trajectoire → 3 exercices, classe A côté moteur", () => {
    const input = mapWizardToSimulation(
      wizardPret({
        revenuE1: revenuIndependant({
          profil: "dirigeant_gerant_artisan",
          maturiteActivite: "trois_ans_ou_plus",
          utiliserTrajectoire: true,
          nMoins2: "36000",
          nMoins1: "42000",
          n: "48000",
        }),
      }),
    );
    const rev = input.foyer.emprunteurs[0]!.revenusProfessionnels[0]!;
    assert.deepEqual(rev.trajectoireAnnuelle, {
      nMoins2: 36_000,
      nMoins1: 42_000,
      n: 48_000,
    });
    assert.equal(rev.montantMensuel, undefined);

    const agg = aggreguerRevenusRetenus(
      input.foyer.emprunteurs,
      [],
      CONSTANTES_DEFAUT,
    );
    assert.equal(agg.revenusAnalyses[0]?.classe, "A");
    assert.ok(Math.abs(agg.totalRetenuMensuel - 3_500) < 0.01);
  });

  it("≥ 3 ans + moyenne seule → pas de zéros inventés en N-2/N-1", () => {
    const input = mapWizardToSimulation(
      wizardPret({
        revenuE1: revenuIndependant({
          profil: "dirigeant_gerant_artisan",
          maturiteActivite: "trois_ans_ou_plus",
          montantMensuel: "3500",
          utiliserTrajectoire: false,
        }),
      }),
    );
    const rev = input.foyer.emprunteurs[0]!.revenusProfessionnels[0]!;
    assert.equal(rev.trajectoireAnnuelle, undefined);
    assert.equal(rev.montantMensuel, 3_500);
    assert.equal(rev.maturiteActivite, "trois_ans_ou_plus");
  });
});

describe("§3.2 — verdicts métier (résultats attendus)", () => {
  it("dirigeant ≥ 3 ans, moyenne 4000 € → VERT (Visite recommandée)", () => {
    const r = executerMoteur(simulationDirigeant("trois_ans_ou_plus", 4_000));
    const v = r.referenceSimulation.agentVerdict;
    assert.equal(v.niveau, "VERT");
    assert.equal(v.badge, "Visite recommandée");
    assert.equal(v.plafonneParIncertitude, false);
    assert.ok(
      Math.abs(r.referenceSimulation.indicateurs.revenusRetenusMensuels - 4_000) <
        0.01,
    );
  });

  it("dirigeant < 1 an, même chiffres → ORANGE (incertitude déterminante)", () => {
    const r = executerMoteur(simulationDirigeant("moins_1_an", 4_000));
    const v = r.referenceSimulation.agentVerdict;
    assert.equal(v.niveau, "ORANGE");
    assert.equal(v.badge, "Visite possible");
    assert.equal(v.plafonneParIncertitude, true);
    assert.ok(v.motifs.includes("incertitude_revenu_determinante"));
    // Le montant reste bien pris en compte dans le calcul « avec »
    assert.ok(
      Math.abs(r.referenceSimulation.indicateurs.revenusRetenusMensuels - 4_000) <
        0.01,
    );
  });

  it("dirigeant 1–2 ans → ORANGE si déterminant (même logique que < 1 an)", () => {
    const r = executerMoteur(simulationDirigeant("un_a_deux_ans", 4_000));
    assert.equal(r.referenceSimulation.agentVerdict.niveau, "ORANGE");
    assert.equal(
      r.referenceSimulation.agentVerdict.plafonneParIncertitude,
      true,
    );
  });

  it("dirigeant récent + co-emprunteur CDI solide → VERT (incertitude non déterminante)", () => {
    const r = executerMoteur(
      simulationDirigeant("moins_1_an", 2_000, {
        emprunteurs: [
          {
            id: "E1",
            revenusProfessionnels: [
              {
                profil: "dirigeant_gerant_artisan",
                montantMensuel: 2_000,
                maturiteActivite: "moins_1_an",
              },
            ],
          },
          {
            id: "E2",
            revenusProfessionnels: [
              {
                profil: "cdi_confirme",
                montantMensuel: 4_500,
              },
            ],
          },
        ],
      }),
    );
    const v = r.referenceSimulation.agentVerdict;
    assert.equal(v.niveau, "VERT");
    assert.equal(v.badge, "Visite recommandée");
    assert.equal(v.plafonneParIncertitude, false);
  });

  it("micro vente récente : CA retenu × 29 %, classe B → plafond Orange si seul", () => {
    const input: SimulationInput = {
      typeProjet: "residence_principale",
      bien: { prixAcquisition: 180_000, travaux: 0, typeBien: "ancien" },
      foyer: {
        emprunteurs: [
          {
            id: "E1",
            revenusProfessionnels: [
              {
                profil: "micro_vente",
                montantMensuel: 12_000, // retenu 3 480
                maturiteActivite: "moins_1_an",
              },
            ],
          },
        ],
        personnesACharge: 0,
        logementActuel: {
          statut: "locataire",
          chargeLogementMensuelle: 700,
        },
        liquidites: {
          epargneDisponible: 50_000,
          epargneMensuelleMoyenne: 300,
        },
        lignesDynamiques: [],
      },
      financement: {
        apport: 40_000,
        tauxNominalAnnuel: 3.5,
        tauxAssuranceAnnuel: 0.34,
      },
    };

    const agg = aggreguerRevenusRetenus(
      input.foyer.emprunteurs,
      [],
      CONSTANTES_DEFAUT,
    );
    assert.equal(agg.revenusAnalyses[0]?.classe, "B");
    assert.ok(Math.abs(agg.totalRetenuMensuel - 12_000 * 0.29) < 0.01);

    const r = executerMoteur(input);
    assert.equal(r.referenceSimulation.agentVerdict.niveau, "ORANGE");
    assert.equal(r.referenceSimulation.agentVerdict.badge, "Visite possible");
  });

  it("parcours wizard complet : dirigeant mature moyenne → VERT", () => {
    const input = mapWizardToSimulation(wizardPret());
    const r = executerMoteur(input);
    assert.equal(r.referenceSimulation.agentVerdict.niveau, "VERT");
    assert.equal(
      r.referenceSimulation.agentVerdict.badge,
      "Visite recommandée",
    );
  });

  it("parcours wizard complet : dirigeant < 1 an → ORANGE", () => {
    const input = mapWizardToSimulation(
      wizardPret({
        revenuE1: revenuIndependant({
          profil: "dirigeant_gerant_artisan",
          maturiteActivite: "moins_1_an",
          montantMensuel: "4000",
        }),
      }),
    );
    const r = executerMoteur(input);
    assert.equal(r.referenceSimulation.agentVerdict.niveau, "ORANGE");
    assert.equal(r.referenceSimulation.agentVerdict.badge, "Visite possible");
    assert.equal(
      r.referenceSimulation.agentVerdict.plafonneParIncertitude,
      true,
    );
  });
});
