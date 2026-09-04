/**
 * Formules de crédit amortissable à taux fixe (mensualités constantes).
 * Hors / avec assurance proportionnelle au capital initial (hypothèse MVP simple).
 */

export type CreditInputs = {
  capital: number;
  /** Taux nominal annuel en % (ex. 3.5) */
  tauxAnnuel: number;
  /** Durée en années */
  dureeAnnees: number;
  /** Taux d'assurance annuel en % du capital (ex. 0.34) */
  tauxAssuranceAnnuel: number;
};

export type VariableCalculee =
  | "capital"
  | "mensualite"
  | "duree"
  | "taux";

export type CreditResult = {
  capital: number;
  tauxAnnuel: number;
  dureeAnnees: number;
  tauxAssuranceAnnuel: number;
  mensualiteHorsAssurance: number;
  mensualiteAssurance: number;
  mensualiteTotale: number;
  coutTotalCredit: number;
  coutInterets: number;
  coutAssurance: number;
};

const EPSILON = 1e-10;
const MAX_ITER = 80;

function assertFinitePositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} invalide`);
  }
}

/** Mensualité hors assurance pour un prêt amortissable. */
export function mensualiteHorsAssurance(
  capital: number,
  tauxAnnuel: number,
  dureeAnnees: number,
): number {
  assertFinitePositive(capital, "Capital");
  assertFinitePositive(tauxAnnuel, "Taux");
  assertFinitePositive(dureeAnnees, "Durée");
  if (capital === 0 || dureeAnnees === 0) return 0;

  const n = dureeAnnees * 12;
  const r = tauxAnnuel / 100 / 12;
  if (Math.abs(r) < EPSILON) return capital / n;
  return (capital * r) / (1 - Math.pow(1 + r, -n));
}

export function mensualiteAssurance(
  capital: number,
  tauxAssuranceAnnuel: number,
): number {
  assertFinitePositive(capital, "Capital");
  assertFinitePositive(tauxAssuranceAnnuel, "Taux d'assurance");
  return (capital * (tauxAssuranceAnnuel / 100)) / 12;
}

/** Capital remboursable pour une mensualité hors assurance donnée. */
export function capitalDepuisMensualite(
  mensualiteHorsAss: number,
  tauxAnnuel: number,
  dureeAnnees: number,
): number {
  assertFinitePositive(mensualiteHorsAss, "Mensualité");
  assertFinitePositive(tauxAnnuel, "Taux");
  assertFinitePositive(dureeAnnees, "Durée");
  if (mensualiteHorsAss === 0 || dureeAnnees === 0) return 0;

  const n = dureeAnnees * 12;
  const r = tauxAnnuel / 100 / 12;
  if (Math.abs(r) < EPSILON) return mensualiteHorsAss * n;
  return (mensualiteHorsAss * (1 - Math.pow(1 + r, -n))) / r;
}

/**
 * Capital pour une mensualité totale (crédit + assurance sur capital initial).
 * M_tot = C * facteurAmortissement + C * a/12
 */
export function capitalDepuisMensualiteTotale(
  mensualiteTotale: number,
  tauxAnnuel: number,
  dureeAnnees: number,
  tauxAssuranceAnnuel: number,
): number {
  assertFinitePositive(mensualiteTotale, "Mensualité");
  assertFinitePositive(tauxAnnuel, "Taux");
  assertFinitePositive(dureeAnnees, "Durée");
  assertFinitePositive(tauxAssuranceAnnuel, "Taux d'assurance");
  if (mensualiteTotale === 0 || dureeAnnees === 0) return 0;

  const n = dureeAnnees * 12;
  const r = tauxAnnuel / 100 / 12;
  const a = tauxAssuranceAnnuel / 100 / 12;
  const facteur =
    Math.abs(r) < EPSILON ? 1 / n : r / (1 - Math.pow(1 + r, -n));
  const denom = facteur + a;
  if (denom <= 0) throw new Error("Paramètres incohérents");
  return mensualiteTotale / denom;
}

/** Durée en années pour une mensualité hors assurance. */
export function dureeDepuisMensualite(
  capital: number,
  mensualiteHorsAss: number,
  tauxAnnuel: number,
): number {
  assertFinitePositive(capital, "Capital");
  assertFinitePositive(mensualiteHorsAss, "Mensualité");
  assertFinitePositive(tauxAnnuel, "Taux");
  if (capital === 0) return 0;
  if (mensualiteHorsAss <= 0) throw new Error("Mensualité trop faible");

  const r = tauxAnnuel / 100 / 12;
  if (Math.abs(r) < EPSILON) {
    return capital / mensualiteHorsAss / 12;
  }

  const ratio = 1 - (capital * r) / mensualiteHorsAss;
  if (ratio <= 0) {
    throw new Error(
      "Cette mensualité ne permet pas de rembourser le capital à ce taux",
    );
  }
  const n = -Math.log(ratio) / Math.log(1 + r);
  return n / 12;
}

/**
 * Durée en années pour une mensualité totale (assurance constante sur capital).
 * On isole la part hors assurance puis on applique la formule classique.
 */
export function dureeDepuisMensualiteTotale(
  capital: number,
  mensualiteTotale: number,
  tauxAnnuel: number,
  tauxAssuranceAnnuel: number,
): number {
  const ass = mensualiteAssurance(capital, tauxAssuranceAnnuel);
  const horsAss = mensualiteTotale - ass;
  if (horsAss <= 0) {
    throw new Error(
      "La mensualité ne couvre pas l'assurance seule — augmentez-la",
    );
  }
  return dureeDepuisMensualite(capital, horsAss, tauxAnnuel);
}

/** Taux annuel (%) hors assurance, par dichotomie. */
export function tauxDepuisMensualite(
  capital: number,
  mensualiteHorsAss: number,
  dureeAnnees: number,
): number {
  assertFinitePositive(capital, "Capital");
  assertFinitePositive(mensualiteHorsAss, "Mensualité");
  assertFinitePositive(dureeAnnees, "Durée");
  if (capital === 0 || dureeAnnees === 0) return 0;

  const n = dureeAnnees * 12;
  const mMin = capital / n;
  if (mensualiteHorsAss + EPSILON < mMin) {
    throw new Error(
      "Cette mensualité est inférieure au remboursement sans intérêts",
    );
  }
  if (Math.abs(mensualiteHorsAss - mMin) < 0.01) return 0;

  let low = 0;
  let high = 100; // % annuel — plafond de recherche
  // S'assurer que high est assez haut
  while (
    mensualiteHorsAssurance(capital, high, dureeAnnees) < mensualiteHorsAss &&
    high < 1000
  ) {
    high *= 2;
  }

  for (let i = 0; i < MAX_ITER; i++) {
    const mid = (low + high) / 2;
    const m = mensualiteHorsAssurance(capital, mid, dureeAnnees);
    if (m > mensualiteHorsAss) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

export function tauxDepuisMensualiteTotale(
  capital: number,
  mensualiteTotale: number,
  dureeAnnees: number,
  tauxAssuranceAnnuel: number,
): number {
  const ass = mensualiteAssurance(capital, tauxAssuranceAnnuel);
  const horsAss = mensualiteTotale - ass;
  if (horsAss <= 0) {
    throw new Error(
      "La mensualité ne couvre pas l'assurance seule — augmentez-la",
    );
  }
  return tauxDepuisMensualite(capital, horsAss, dureeAnnees);
}

export function buildResult(inputs: CreditInputs): CreditResult {
  const {
    capital,
    tauxAnnuel,
    dureeAnnees,
    tauxAssuranceAnnuel,
  } = inputs;

  const mHors = mensualiteHorsAssurance(capital, tauxAnnuel, dureeAnnees);
  const mAss = mensualiteAssurance(capital, tauxAssuranceAnnuel);
  const mTot = mHors + mAss;
  const n = dureeAnnees * 12;
  const coutTotal = mTot * n;
  const coutAssurance = mAss * n;
  const coutInterets = Math.max(0, mHors * n - capital);

  return {
    capital,
    tauxAnnuel,
    dureeAnnees,
    tauxAssuranceAnnuel,
    mensualiteHorsAssurance: mHors,
    mensualiteAssurance: mAss,
    mensualiteTotale: mTot,
    coutTotalCredit: coutTotal,
    coutInterets,
    coutAssurance,
  };
}

export function calculerVariable(
  cible: VariableCalculee,
  partial: Partial<CreditInputs> & {
    mensualiteTotale?: number;
  },
): CreditResult {
  const tauxAssuranceAnnuel = partial.tauxAssuranceAnnuel ?? 0;

  switch (cible) {
    case "mensualite": {
      const capital = partial.capital ?? 0;
      const tauxAnnuel = partial.tauxAnnuel ?? 0;
      const dureeAnnees = partial.dureeAnnees ?? 0;
      return buildResult({
        capital,
        tauxAnnuel,
        dureeAnnees,
        tauxAssuranceAnnuel,
      });
    }
    case "capital": {
      const mensualiteTotale = partial.mensualiteTotale ?? 0;
      const tauxAnnuel = partial.tauxAnnuel ?? 0;
      const dureeAnnees = partial.dureeAnnees ?? 0;
      const capital = capitalDepuisMensualiteTotale(
        mensualiteTotale,
        tauxAnnuel,
        dureeAnnees,
        tauxAssuranceAnnuel,
      );
      return buildResult({
        capital,
        tauxAnnuel,
        dureeAnnees,
        tauxAssuranceAnnuel,
      });
    }
    case "duree": {
      const capital = partial.capital ?? 0;
      const mensualiteTotale = partial.mensualiteTotale ?? 0;
      const tauxAnnuel = partial.tauxAnnuel ?? 0;
      const dureeAnnees = dureeDepuisMensualiteTotale(
        capital,
        mensualiteTotale,
        tauxAnnuel,
        tauxAssuranceAnnuel,
      );
      return buildResult({
        capital,
        tauxAnnuel,
        dureeAnnees,
        tauxAssuranceAnnuel,
      });
    }
    case "taux": {
      const capital = partial.capital ?? 0;
      const mensualiteTotale = partial.mensualiteTotale ?? 0;
      const dureeAnnees = partial.dureeAnnees ?? 0;
      const tauxAnnuel = tauxDepuisMensualiteTotale(
        capital,
        mensualiteTotale,
        dureeAnnees,
        tauxAssuranceAnnuel,
      );
      return buildResult({
        capital,
        tauxAnnuel,
        dureeAnnees,
        tauxAssuranceAnnuel,
      });
    }
    default: {
      const _exhaustive: never = cible;
      return _exhaustive;
    }
  }
}

export function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatEurosPrecis(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPourcent(value: number, digits = 2): string {
  return `${value.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} %`;
}

export function formatDuree(annees: number): string {
  const moisTotaux = Math.round(annees * 12);
  const a = Math.floor(moisTotaux / 12);
  const m = moisTotaux % 12;
  if (a === 0) return `${m} mois`;
  if (m === 0) return a === 1 ? "1 an" : `${a} ans`;
  return `${a} an${a > 1 ? "s" : ""} et ${m} mois`;
}
