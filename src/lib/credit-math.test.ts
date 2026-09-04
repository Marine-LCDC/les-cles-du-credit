import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildResult,
  calculerVariable,
  capitalDepuisMensualiteTotale,
  dureeDepuisMensualiteTotale,
  mensualiteHorsAssurance,
  tauxDepuisMensualiteTotale,
} from "./credit-math";

describe("credit-math — cohérence aller-retour", () => {
  const capital = 250_000;
  const tauxAnnuel = 3.5;
  const dureeAnnees = 25;
  const tauxAssuranceAnnuel = 0.34;

  it("calcule une mensualité réaliste", () => {
    const r = buildResult({
      capital,
      tauxAnnuel,
      dureeAnnees,
      tauxAssuranceAnnuel,
    });
    // ~1 250 € hors ass. + ~71 € ass. ≈ 1 321 €
    assert.ok(r.mensualiteHorsAssurance > 1200 && r.mensualiteHorsAssurance < 1300);
    assert.ok(r.mensualiteTotale > r.mensualiteHorsAssurance);
  });

  it("retrouve le capital depuis la mensualité totale", () => {
    const base = buildResult({
      capital,
      tauxAnnuel,
      dureeAnnees,
      tauxAssuranceAnnuel,
    });
    const retrouve = capitalDepuisMensualiteTotale(
      base.mensualiteTotale,
      tauxAnnuel,
      dureeAnnees,
      tauxAssuranceAnnuel,
    );
    assert.ok(Math.abs(retrouve - capital) < 1);
  });

  it("retrouve la durée depuis la mensualité totale", () => {
    const base = buildResult({
      capital,
      tauxAnnuel,
      dureeAnnees,
      tauxAssuranceAnnuel,
    });
    const retrouve = dureeDepuisMensualiteTotale(
      capital,
      base.mensualiteTotale,
      tauxAnnuel,
      tauxAssuranceAnnuel,
    );
    assert.ok(Math.abs(retrouve - dureeAnnees) < 0.01);
  });

  it("retrouve le taux depuis la mensualité totale", () => {
    const base = buildResult({
      capital,
      tauxAnnuel,
      dureeAnnees,
      tauxAssuranceAnnuel,
    });
    const retrouve = tauxDepuisMensualiteTotale(
      capital,
      base.mensualiteTotale,
      dureeAnnees,
      tauxAssuranceAnnuel,
    );
    assert.ok(Math.abs(retrouve - tauxAnnuel) < 0.01);
  });

  it("calcule via calculerVariable (mensualité)", () => {
    const r = calculerVariable("mensualite", {
      capital,
      tauxAnnuel,
      dureeAnnees,
      tauxAssuranceAnnuel,
    });
    const direct = mensualiteHorsAssurance(capital, tauxAnnuel, dureeAnnees);
    assert.ok(Math.abs(r.mensualiteHorsAssurance - direct) < 0.01);
  });

  it("taux 0 % → amortissement linéaire", () => {
    const m = mensualiteHorsAssurance(120_000, 0, 10);
    assert.equal(Math.round(m), 1000);
  });
});
