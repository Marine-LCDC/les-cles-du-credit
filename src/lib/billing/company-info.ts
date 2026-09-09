/** Normalise un SIRET (chiffres uniquement). */
export function normalizeSiret(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normalise un n° TVA FR (majuscules, sans espaces). */
export function normalizeFrenchVat(value: string): string {
  return value.replace(/[\s.]/g, "").toUpperCase();
}

/** Clé de contrôle TVA française à partir du SIREN (9 chiffres). */
export function frenchVatFromSiren(siren: string): string {
  const n = Number.parseInt(siren, 10);
  if (!Number.isFinite(n) || siren.length !== 9) {
    throw new Error("SIREN invalide.");
  }
  const key = (12 + 3 * (n % 97)) % 97;
  return `FR${String(key).padStart(2, "0")}${siren}`;
}

/** Algorithme de Luhn (SIRET français). */
export function isValidSiret(siret: string): boolean {
  const digits = normalizeSiret(siret);
  if (!/^\d{14}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let n = Number(digits[i]);
    if (i % 2 === 0) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export function isValidFrenchVat(vat: string): boolean {
  const normalized = normalizeFrenchVat(vat);
  return /^FR[A-Z0-9]{2}\d{9}$/.test(normalized);
}

export type CompanyBillingInput = {
  email: string;
  companyName: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  siret: string;
  vatNumber: string;
};

export type ParsedCompanyBilling = {
  email: string;
  companyName: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  siret: string;
  vatNumber: string;
};

export function parseCompanyBilling(
  input: Partial<CompanyBillingInput>,
): { ok: true; data: ParsedCompanyBilling } | { ok: false; error: string } {
  const email = input.email?.trim().toLowerCase() ?? "";
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Adresse e-mail professionnelle requise." };
  }

  const companyName = input.companyName?.trim() ?? "";
  if (companyName.length < 2) {
    return { ok: false, error: "Raison sociale requise." };
  }

  const addressLine1 = input.addressLine1?.trim() ?? "";
  if (addressLine1.length < 3) {
    return { ok: false, error: "Adresse de facturation requise." };
  }

  const postalCode = input.postalCode?.trim() ?? "";
  if (!/^\d{5}$/.test(postalCode)) {
    return { ok: false, error: "Code postal invalide (5 chiffres)." };
  }

  const city = input.city?.trim() ?? "";
  if (city.length < 2) {
    return { ok: false, error: "Ville requise." };
  }

  const siret = normalizeSiret(input.siret ?? "");
  if (!isValidSiret(siret)) {
    return { ok: false, error: "SIRET invalide (14 chiffres)." };
  }

  let vatNumber = normalizeFrenchVat(input.vatNumber ?? "");
  if (!vatNumber) {
    vatNumber = frenchVatFromSiren(siret.slice(0, 9));
  }
  if (!isValidFrenchVat(vatNumber)) {
    return {
      ok: false,
      error: "N° de TVA invalide (ex. FR12345678901).",
    };
  }

  return {
    ok: true,
    data: {
      email,
      companyName,
      addressLine1,
      postalCode,
      city,
      siret,
      vatNumber,
    },
  };
}
