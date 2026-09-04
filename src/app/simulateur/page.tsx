import type { Metadata } from "next";
import SimulateurClient from "./simulateur-client";

export const metadata: Metadata = {
  title: "Simulateur de crédit",
  description:
    "Estimez votre mensualité, votre capital empruntable, la durée ou le taux — outil indicatif gratuit.",
};

export default function SimulateurPage() {
  return <SimulateurClient />;
}
