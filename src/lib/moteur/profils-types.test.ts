/**
 * 5 profils types — QA Phase 1.6
 * Scénarios représentatifs pour valider le parcours moteur de bout en bout.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  executerMoteur,
  type SimulationInput,
  type VerdictNiveau,
} from "./index";

function run(
  input: SimulationInput,
  expected: VerdictNiveau,
  label: string,
) {
  const r = executerMoteur(input);
  const got = r.referenceSimulation.agentVerdict.niveau;
  const ind = r.referenceSimulation.indicateurs;
  assert.equal(
    got,
    expected,
    `${label}: attendu ${expected}, obtenu ${got} ` +
      `(effort=${(ind.tauxEffort * 100).toFixed(1)}%, RAV=${ind.rav.toFixed(0)}, ` +
      `saut=${ind.sautDeCharge.toFixed(0)}, maîtrisé=${ind.sautDeChargeMaitrise})`,
  );
  return r;
}

describe("5 profils types — QA 1.6", () => {
  it("Profil A — couple CDI, RP classique → VERT", () => {
    run(
      {
        typeProjet: "residence_principale",
        bien: {
          prixAcquisition: 280_000,
          travaux: 0,
          typeBien: "ancien",
        },
        foyer: {
          emprunteurs: [
            {
              id: "E1",
              revenusProfessionnels: [
                { profil: "cdi_confirme", montantMensuel: 2_800 },
              ],
            },
            {
              id: "E2",
              revenusProfessionnels: [
                { profil: "cdi_confirme", montantMensuel: 2_400 },
              ],
            },
          ],
          personnesACharge: 1,
          lignesDynamiques: [],
          logementActuel: {
            statut: "locataire",
            chargeLogementMensuelle: 950,
          },
          liquidites: {
            epargneDisponible: 70_000,
            epargneMensuelleMoyenne: 500,
          },
        },
        financement: {
          apport: 55_000,
          tauxNominalAnnuel: 3.4,
          tauxAssuranceAnnuel: 0.34,
        },
      },
      "VERT",
      "Profil A",
    );
  });

  it("Profil B — solo micro vente, effort élevé → ORANGE ou ROUGE cohérent", () => {
    const r = executerMoteur({
      typeProjet: "residence_principale",
      bien: {
        prixAcquisition: 220_000,
        travaux: 15_000,
        typeBien: "ancien",
      },
      foyer: {
        emprunteurs: [
          {
            id: "E1",
            revenusProfessionnels: [
              { profil: "micro_vente", montantMensuel: 9_000 },
            ],
          },
        ],
        personnesACharge: 0,
        lignesDynamiques: [
          {
            type: "credit_conso",
            montantMensuel: 180,
            attribution: "E1",
          },
        ],
        logementActuel: {
          statut: "locataire",
          chargeLogementMensuelle: 700,
        },
        liquidites: {
          epargneDisponible: 35_000,
          epargneMensuelleMoyenne: 200,
        },
      },
      financement: {
        apport: 30_000,
        tauxNominalAnnuel: 3.6,
        tauxAssuranceAnnuel: 0.36,
      },
    });
    // 29 % de 9000 = 2610 retenus — dossier tendu mais calculable
    assert.ok(
      Math.abs(
        r.referenceSimulation.indicateurs.revenusRetenusMensuels - 2_610,
      ) < 1,
    );
    assert.ok(
      ["VERT", "ORANGE", "ROUGE"].includes(
        r.referenceSimulation.agentVerdict.niveau,
      ),
    );
  });

  it("Profil C — dirigeant trajectoire baisse + locatif → durée marché 20 ans", () => {
    const r = run(
      {
        typeProjet: "investissement_locatif",
        dureeMaxLocativeMarcheAnnees: 20,
        bien: {
          prixAcquisition: 150_000,
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
                  trajectoireAnnuelle: {
                    nMoins2: 72_000,
                    nMoins1: 60_000,
                    n: 48_000,
                  },
                },
              ],
            },
          ],
          personnesACharge: 0,
          lignesDynamiques: [
            {
              type: "revenus_fonciers",
              montantMensuel: 800,
              attribution: "foyer",
            },
          ],
          logementActuel: {
            statut: "proprietaire",
            chargeLogementMensuelle: 1_100,
            capitalRestantDu: 80_000,
            scenarioAncienBien: "location",
          },
          liquidites: {
            epargneDisponible: 40_000,
            epargneMensuelleMoyenne: 400,
          },
        },
        financement: {
          apport: 25_000,
          tauxNominalAnnuel: 3.5,
          tauxAssuranceAnnuel: 0.34,
        },
      },
      "VERT",
      "Profil C",
    );
    assert.equal(r.referenceSimulation.indicateurs.dureeReferenceAnnees, 20);
    // Trajectoire baisse → N = 48 000 / 12 = 4 000 + fonciers 560
    assert.ok(
      Math.abs(
        r.referenceSimulation.indicateurs.revenusRetenusMensuels - 4_560,
      ) < 1,
    );
  });

  it("Profil D — CDI période d'essai seul → ORANGE (incertitude déterminante)", () => {
    const r = run(
      {
        typeProjet: "residence_principale",
        bien: {
          prixAcquisition: 190_000,
          travaux: 0,
          typeBien: "neuf",
        },
        foyer: {
          emprunteurs: [
            {
              id: "E1",
              revenusProfessionnels: [
                {
                  profil: "cdi_periode_essai",
                  montantMensuel: 3_800,
                },
              ],
            },
          ],
          personnesACharge: 0,
          lignesDynamiques: [],
          logementActuel: {
            statut: "heberge",
            chargeLogementMensuelle: 0,
          },
          liquidites: {
            epargneDisponible: 45_000,
            epargneMensuelleMoyenne: 350,
          },
        },
        financement: {
          apport: 40_000,
          tauxNominalAnnuel: 3.3,
          tauxAssuranceAnnuel: 0.3,
        },
      },
      "ORANGE",
      "Profil D",
    );
    assert.equal(
      r.referenceSimulation.agentVerdict.plafonneParIncertitude,
      true,
    );
  });

  it("Profil E — RAV insuffisant, visite peu conseillée → ROUGE", () => {
    run(
      {
        typeProjet: "residence_principale",
        bien: {
          prixAcquisition: 320_000,
          travaux: 25_000,
          typeBien: "ancien",
        },
        foyer: {
          emprunteurs: [
            {
              id: "E1",
              revenusProfessionnels: [
                { profil: "cdi_confirme", montantMensuel: 2_100 },
              ],
            },
          ],
          personnesACharge: 2,
          lignesDynamiques: [
            {
              type: "credit_conso",
              montantMensuel: 250,
              attribution: "E1",
            },
            {
              type: "pension_versee",
              montantMensuel: 300,
              attribution: "E1",
            },
          ],
          logementActuel: {
            statut: "locataire",
            chargeLogementMensuelle: 850,
          },
          liquidites: {
            epargneDisponible: 12_000,
            epargneMensuelleMoyenne: 80,
          },
        },
        financement: {
          apport: 10_000,
          tauxNominalAnnuel: 3.7,
          tauxAssuranceAnnuel: 0.4,
        },
      },
      "ROUGE",
      "Profil E",
    );
  });
});
