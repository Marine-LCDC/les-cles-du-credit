/**
 * Suite de tests du moteur financier — 15 cas métier + unités.
 * Critère de done roadmap 1.3 : 15 cas de test validés.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  aggreguerRevenusRetenus,
  appliquerTrajectoireTriennale,
  CONSTANTES_DEFAUT,
  dureeReference,
  executerMoteur,
  fraisAcquisitionEstimes,
  type SimulationInput,
  type VerdictNiveau,
} from "./index";

function baseSimulation(
  overrides: {
    prix?: number;
    travaux?: number;
    typeBien?: "ancien" | "neuf";
    fraisAcquisitionEuros?: number;
    typeProjet?: SimulationInput["typeProjet"];
    dureeMaxLocative?: number;
    revenuMensuel?: number;
    profil?: SimulationInput["foyer"]["emprunteurs"][0]["revenusProfessionnels"][0]["profil"];
    coEmprunteurRevenu?: number;
    personnesACharge?: number;
    chargeLogement?: number;
    statutLogement?: SimulationInput["foyer"]["logementActuel"]["statut"];
    scenario?: SimulationInput["foyer"]["logementActuel"]["scenarioAncienBien"];
    capitalRestantDu?: number;
    prixVenteEstime?: number;
    loyerRestant?: number;
    epargneDisponible?: number;
    epargneMensuelle?: number;
    apport?: number;
    taux?: number;
    assurance?: number;
    dureePerso?: number;
    lignes?: SimulationInput["foyer"]["lignesDynamiques"];
    emprunteurs?: SimulationInput["foyer"]["emprunteurs"];
  } = {},
): SimulationInput {
  const emprunteurs =
    overrides.emprunteurs ??
    ([
      {
        id: "E1" as const,
        revenusProfessionnels: [
          {
            profil: overrides.profil ?? "cdi_confirme",
            montantMensuel: overrides.revenuMensuel ?? 3_500,
          },
        ],
      },
      ...(overrides.coEmprunteurRevenu !== undefined
        ? [
            {
              id: "E2" as const,
              revenusProfessionnels: [
                {
                  profil: "cdi_confirme" as const,
                  montantMensuel: overrides.coEmprunteurRevenu,
                },
              ],
            },
          ]
        : []),
    ] as SimulationInput["foyer"]["emprunteurs"]);

  return {
    typeProjet: overrides.typeProjet ?? "residence_principale",
    dureeMaxLocativeMarcheAnnees: overrides.dureeMaxLocative,
    bien: {
      prixAcquisition: overrides.prix ?? 200_000,
      travaux: overrides.travaux ?? 0,
      typeBien: overrides.typeBien ?? "ancien",
      fraisAcquisitionEuros: overrides.fraisAcquisitionEuros,
    },
    foyer: {
      emprunteurs,
      personnesACharge: overrides.personnesACharge ?? 0,
      lignesDynamiques: overrides.lignes ?? [],
      logementActuel: {
        statut: overrides.statutLogement ?? "locataire",
        chargeLogementMensuelle: overrides.chargeLogement ?? 800,
        scenarioAncienBien: overrides.scenario ?? null,
        capitalRestantDu: overrides.capitalRestantDu,
        prixVenteEstime: overrides.prixVenteEstime,
        loyerRestantApresOperation: overrides.loyerRestant,
      },
      liquidites: {
        epargneDisponible: overrides.epargneDisponible ?? 50_000,
        epargneMensuelleMoyenne: overrides.epargneMensuelle ?? 400,
      },
    },
    financement: {
      apport: overrides.apport ?? 40_000,
      tauxNominalAnnuel: overrides.taux ?? 3.5,
      tauxAssuranceAnnuel: overrides.assurance ?? 0.34,
      dureePersonnelleAnnees: overrides.dureePerso,
    },
  };
}

function assertVerdict(input: SimulationInput, expected: VerdictNiveau) {
  const r = executerMoteur(input);
  assert.equal(
    r.referenceSimulation.agentVerdict.niveau,
    expected,
    `Attendu ${expected}, obtenu ${r.referenceSimulation.agentVerdict.niveau} ` +
      `(effort=${(r.referenceSimulation.indicateurs.tauxEffort * 100).toFixed(1)}%, ` +
      `RAV=${r.referenceSimulation.indicateurs.rav.toFixed(0)}, ` +
      `saut=${r.referenceSimulation.indicateurs.sautDeCharge.toFixed(0)}, ` +
      `maîtrisé=${r.referenceSimulation.indicateurs.sautDeChargeMaitrise}, ` +
      `couverture=${r.referenceSimulation.indicateurs.couvertureSautMois?.toFixed(0) ?? "n/a"})`,
  );
  return r;
}

// ---------------------------------------------------------------------------
describe("Unités — trajectoire, frais, durée, micro", () => {
  it("trajectoire hausse → moyenne des 3", () => {
    const r = appliquerTrajectoireTriennale({
      nMoins2: 30_000,
      nMoins1: 36_000,
      n: 42_000,
    });
    assert.equal(r.annuelRetenu, 36_000);
    assert.equal(r.methode, "trajectoire_hausse_ou_stable_moyenne");
  });

  it("trajectoire baisse → année N seule", () => {
    const r = appliquerTrajectoireTriennale({
      nMoins2: 50_000,
      nMoins1: 40_000,
      n: 30_000,
    });
    assert.equal(r.annuelRetenu, 30_000);
    assert.equal(r.methode, "trajectoire_baisse_annee_N");
  });

  it("frais acquisition auto ancien 7,5 % sur prix seul", () => {
    const f = fraisAcquisitionEstimes(
      { prixAcquisition: 200_000, travaux: 20_000, typeBien: "ancien" },
      CONSTANTES_DEFAUT,
    );
    assert.equal(f, 15_000);
  });

  it("frais acquisition override agent en €", () => {
    const f = fraisAcquisitionEstimes(
      {
        prixAcquisition: 200_000,
        travaux: 0,
        typeBien: "ancien",
        fraisAcquisitionEuros: 12_345,
      },
      CONSTANTES_DEFAUT,
    );
    assert.equal(f, 12_345);
  });

  it("durée référence RP = 25 ans ; locatif = min(réglementaire, marché)", () => {
    assert.equal(
      dureeReference("residence_principale", CONSTANTES_DEFAUT),
      25,
    );
    assert.equal(
      dureeReference("investissement_locatif", CONSTANTES_DEFAUT, 20),
      20,
    );
  });

  it("micro vente retient 29 % du CA", () => {
    const agg = aggreguerRevenusRetenus(
      [
        {
          id: "E1",
          revenusProfessionnels: [
            { profil: "micro_vente", montantMensuel: 10_000 },
          ],
        },
      ],
      [],
      CONSTANTES_DEFAUT,
    );
    assert.equal(agg.totalRetenuMensuel, 2_900);
  });
});

// ---------------------------------------------------------------------------
describe("15 cas métier — verdict", () => {
  /** 1 — CDI classique solide → VERT */
  it("1. CDI confirmé, effort ≤ 35 %, saut maîtrisé → VERT", () => {
    assertVerdict(
      baseSimulation({
        revenuMensuel: 4_000,
        chargeLogement: 900,
        apport: 50_000,
        epargneDisponible: 60_000,
      }),
      "VERT",
    );
  });

  /** 2 — Effort > 35 % mais RAV ok + saut maîtrisé → ORANGE */
  it("2. Effort > 35 %, saut maîtrisé → ORANGE (dérogation)", () => {
    assertVerdict(
      baseSimulation({
        prix: 280_000,
        revenuMensuel: 2_800,
        chargeLogement: 1_200,
        apport: 30_000,
        epargneDisponible: 40_000,
        epargneMensuelle: 2_000, // force maîtrise du saut via épargne mensuelle
      }),
      "ORANGE",
    );
  });

  /** 3 — RAV sous seuil → ROUGE */
  it("3. RAV < seuil prudentiel → ROUGE", () => {
    assertVerdict(
      baseSimulation({
        prix: 350_000,
        revenuMensuel: 1_800,
        chargeLogement: 400,
        apport: 10_000,
        epargneDisponible: 15_000,
        epargneMensuelle: 50,
      }),
      "ROUGE",
    );
  });

  /** 4 — Saut non maîtrisé + filet ≥ 60 mois → ORANGE */
  it("4. Saut non maîtrisé + couverture ≥ 60 mois → ORANGE", () => {
    // Hébergé : saut = mensualité entière
    // RAV juste au-dessus du seuil mais < seuil+saut → saut non maîtrisé
    // Gros stock d'épargne résiduelle → filet ≥ 60 mois → ORANGE
    assertVerdict(
      baseSimulation({
        prix: 180_000,
        revenuMensuel: 2_200,
        statutLogement: "heberge",
        chargeLogement: 0,
        apport: 20_000,
        epargneDisponible: 80_000,
        epargneMensuelle: 50,
      }),
      "ORANGE",
    );
  });

  /** 5 — Saut non maîtrisé + filet < 60 mois → ROUGE */
  it("5. Saut non maîtrisé + couverture < 60 mois → ROUGE", () => {
    assertVerdict(
      baseSimulation({
        prix: 220_000,
        revenuMensuel: 3_000,
        statutLogement: "heberge",
        chargeLogement: 0,
        apport: 15_000,
        epargneDisponible: 20_000,
        epargneMensuelle: 50,
      }),
      "ROUGE",
    );
  });

  /** 6 — Micro vente 29 % */
  it("6. Micro-entreprise vente (29 %) finançable → VERT ou ORANGE cohérent", () => {
    const r = assertVerdict(
      baseSimulation({
        profil: "micro_vente",
        revenuMensuel: 12_000, // CA → retenu 3 480
        chargeLogement: 700,
        apport: 45_000,
        epargneDisponible: 50_000,
        epargneMensuelle: 500,
      }),
      "VERT",
    );
    const micro = r.referenceSimulation.indicateurs.revenusAnalyses.find(
      (a) => a.methode.includes("0.29") || a.methode.includes("micro"),
    );
    assert.ok(micro);
    assert.ok(Math.abs(micro!.montantRetenuMensuel - 3_480) < 0.01);
  });

  /** 7 — Micro prestation BIC 50 % */
  it("7. Micro prestation BIC (50 %) — retenue correcte", () => {
    const agg = aggreguerRevenusRetenus(
      [
        {
          id: "E1",
          revenusProfessionnels: [
            { profil: "micro_prestation_bic", montantMensuel: 8_000 },
          ],
        },
      ],
      [],
      CONSTANTES_DEFAUT,
    );
    assert.equal(agg.totalRetenuMensuel, 4_000);
    assertVerdict(
      baseSimulation({
        profil: "micro_prestation_bic",
        revenuMensuel: 8_000,
        chargeLogement: 800,
        apport: 50_000,
      }),
      "VERT",
    );
  });

  /** 8 — Micro libéral BNC 66 % */
  it("8. Micro libéral BNC (66 %) — retenue correcte", () => {
    const agg = aggreguerRevenusRetenus(
      [
        {
          id: "E1",
          revenusProfessionnels: [
            { profil: "micro_liberal_bnc", montantMensuel: 6_000 },
          ],
        },
      ],
      [],
      CONSTANTES_DEFAUT,
    );
    assert.equal(agg.totalRetenuMensuel, 3_960);
  });

  /** 9 — Dirigeant trajectoire hausse → moyenne */
  it("9. Dirigeant trajectoire hausse → moyenne triennale, VERT", () => {
    const r = assertVerdict(
      {
        ...baseSimulation({
          chargeLogement: 900,
          apport: 50_000,
          epargneMensuelle: 500,
        }),
        foyer: {
          ...baseSimulation().foyer,
          emprunteurs: [
            {
              id: "E1",
              revenusProfessionnels: [
                {
                  profil: "dirigeant_gerant_artisan",
                  trajectoireAnnuelle: {
                    nMoins2: 36_000,
                    nMoins1: 42_000,
                    n: 48_000,
                  },
                },
              ],
            },
          ],
          logementActuel: {
            statut: "locataire",
            chargeLogementMensuelle: 900,
          },
          liquidites: {
            epargneDisponible: 60_000,
            epargneMensuelleMoyenne: 500,
          },
          personnesACharge: 0,
          lignesDynamiques: [],
        },
        financement: {
          apport: 50_000,
          tauxNominalAnnuel: 3.5,
          tauxAssuranceAnnuel: 0.34,
        },
      },
      "VERT",
    );
    // Moyenne = 42 000 / 12 = 3 500
    assert.ok(
      Math.abs(r.referenceSimulation.indicateurs.revenusRetenusMensuels - 3_500) <
        0.01,
    );
  });

  /** 10 — Dirigeant trajectoire baisse → année N */
  it("10. Dirigeant trajectoire baisse → retient N uniquement", () => {
    const r = executerMoteur({
      ...baseSimulation(),
      foyer: {
        ...baseSimulation().foyer,
        emprunteurs: [
          {
            id: "E1",
            revenusProfessionnels: [
              {
                profil: "dirigeant_gerant_artisan",
                trajectoireAnnuelle: {
                  nMoins2: 60_000,
                  nMoins1: 48_000,
                  n: 24_000,
                },
              },
            ],
          },
        ],
      },
    });
    assert.ok(
      Math.abs(r.referenceSimulation.indicateurs.revenusRetenusMensuels - 2_000) <
        0.01,
    );
  });

  /** 11 — CDI période d'essai déterminant → ORANGE */
  it("11. CDI période d'essai déterminant → ORANGE (pas Vert auto)", () => {
    const r = assertVerdict(
      baseSimulation({
        profil: "cdi_periode_essai",
        revenuMensuel: 4_000,
        chargeLogement: 900,
        apport: 50_000,
        epargneDisponible: 60_000,
        epargneMensuelle: 400,
      }),
      "ORANGE",
    );
    assert.equal(r.referenceSimulation.agentVerdict.plafonneParIncertitude, true);
  });

  /** 12 — CDI période d'essai non déterminant (E2 solide) → VERT */
  it("12. CDI période d'essai + co-emprunteur solide → VERT", () => {
    const r = assertVerdict(
      baseSimulation({
        emprunteurs: [
          {
            id: "E1",
            revenusProfessionnels: [
              {
                profil: "cdi_periode_essai",
                montantMensuel: 2_000,
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
        chargeLogement: 1_000,
        apport: 50_000,
        epargneDisponible: 60_000,
        epargneMensuelle: 600,
        prix: 220_000,
      }),
      "VERT",
    );
    assert.equal(
      r.referenceSimulation.agentVerdict.plafonneParIncertitude,
      false,
    );
  });

  /** 13 — Co-emprunt : seuil RAV 1 200 € */
  it("13. Co-emprunt : seuil RAV = 1 200 € (+300/personne à charge)", () => {
    const r = executerMoteur(
      baseSimulation({
        coEmprunteurRevenu: 2_500,
        personnesACharge: 2,
        revenuMensuel: 2_500,
      }),
    );
    // 1200 + 2×300 = 1800
    assert.equal(r.referenceSimulation.indicateurs.ravSeuil, 1_800);
  });

  /** 14 — Dividendes 0 % + fonciers × 0,70 */
  it("14. Dividendes exclus ; revenus fonciers décotés à 70 %", () => {
    const r = executerMoteur(
      baseSimulation({
        revenuMensuel: 3_000,
        lignes: [
          {
            type: "dividendes",
            montantMensuel: 2_000,
            attribution: "E1",
          },
          {
            type: "revenus_fonciers",
            montantMensuel: 1_000,
            attribution: "foyer",
          },
          {
            type: "credit_conso",
            montantMensuel: 150,
            attribution: "E1",
          },
        ],
      }),
    );
    // 3000 + 0 + 700 = 3700
    assert.ok(
      Math.abs(r.referenceSimulation.indicateurs.revenusRetenusMensuels - 3_700) <
        0.01,
    );
    assert.equal(r.referenceSimulation.indicateurs.creditsConservesMensuels, 150);
  });

  /** 15 — personal_simulation n'altère pas agent_verdict ; saut ≤ 0 skip filet */
  it("15. personal_simulation indépendante + durée locative marché", () => {
    const input = baseSimulation({
      typeProjet: "investissement_locatif",
      dureeMaxLocative: 20,
      revenuMensuel: 5_000,
      chargeLogement: 1_500, // charge actuelle > nouvelle mensualité possible
      apport: 60_000,
      epargneDisponible: 80_000,
      dureePerso: 15,
      prix: 180_000,
    });
    const r = executerMoteur(input);
    assert.equal(
      r.referenceSimulation.indicateurs.dureeReferenceAnnees,
      20,
    );
    assert.ok(r.personalSimulation);
    assert.equal(r.personalSimulation!.dureeAnnees, 15);
    // Verdict agent inchangé même si on ne recalcule pas personal pour verdict
    const verdictRef = r.referenceSimulation.agentVerdict.niveau;
    const r2 = executerMoteur({
      ...input,
      financement: { ...input.financement, dureePersonnelleAnnees: undefined },
    });
    assert.equal(r2.referenceSimulation.agentVerdict.niveau, verdictRef);
  });
});
