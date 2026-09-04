import type { Metadata } from "next";
import FaisabiliteClient from "./faisabilite-client";

export const metadata: Metadata = {
  title: "Estimation de faisabilité",
  description:
    "Voyons ensemble votre projet immobilier en 7 étapes — indication de visite claire et chiffrée.",
};

export default function FaisabilitePage() {
  return <FaisabiliteClient />;
}
