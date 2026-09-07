import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parseBienPublic, type BienPublic } from "@/lib/bien-public";
import FaisabiliteClient from "./faisabilite-client";

export const metadata: Metadata = {
  title: "Estimation de faisabilité",
  description:
    "Voyons ensemble votre projet immobilier — indication de visite claire et chiffrée.",
};

async function loadBien(token: string | undefined): Promise<BienPublic | null> {
  if (!token) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_bien_public", {
    p_token: token,
  });
  if (error) return null;
  return parseBienPublic(data);
}

export default async function FaisabilitePage({
  searchParams,
}: {
  searchParams: Promise<{ bien?: string }>;
}) {
  const params = await searchParams;
  const bienLie = await loadBien(params.bien);

  return <FaisabiliteClient bienLie={bienLie} />;
}
