export type BienPublic = {
  id: string;
  public_token: string;
  reference: string;
  nom_residence: string | null;
  ville: string;
  prix_acquisition: number;
  type_bien: "ancien" | "neuf";
  frais_acquisition: number;
  travaux_necessaires: boolean;
  travaux_montant: number;
  duree_max_locative_marche: number;
};

export function parseBienPublic(value: unknown): BienPublic | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;

  if (
    typeof row.id !== "string" ||
    typeof row.public_token !== "string" ||
    typeof row.reference !== "string" ||
    typeof row.ville !== "string" ||
    (row.type_bien !== "ancien" && row.type_bien !== "neuf")
  ) {
    return null;
  }

  const duree =
    typeof row.duree_max_locative_marche === "number"
      ? row.duree_max_locative_marche
      : Number(row.duree_max_locative_marche ?? 25);

  return {
    id: row.id,
    public_token: row.public_token,
    reference: row.reference,
    nom_residence:
      typeof row.nom_residence === "string" ? row.nom_residence : null,
    ville: row.ville,
    prix_acquisition: Number(row.prix_acquisition),
    type_bien: row.type_bien,
    frais_acquisition: Number(row.frais_acquisition),
    travaux_necessaires: Boolean(row.travaux_necessaires),
    travaux_montant: Number(row.travaux_montant ?? 0),
    duree_max_locative_marche: Number.isFinite(duree) ? duree : 25,
  };
}

export function formatEurosFr(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatNombreFr(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
