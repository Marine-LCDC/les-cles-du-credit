/** Aides d'affichage frais — réexport depuis le moteur. */
export {
  TAUX_FRAIS_ACQUISITION_ANCIEN,
  TAUX_FRAIS_ACQUISITION_NEUF,
} from "@/lib/moteur";

export function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
