"use server";

import { createClient } from "@/lib/supabase/server";

export type EnregistrerSimulationInput = {
  token: string;
  prenom: string;
  nom: string;
  email?: string;
  verdict: "vert" | "orange" | "rouge";
};

export type EnregistrerSimulationResult =
  | { ok: true; dossierRef: string }
  | { ok: false; error: string };

export async function enregistrerSimulationVisiteur(
  input: EnregistrerSimulationInput,
): Promise<EnregistrerSimulationResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("enregistrer_simulation", {
    p_token: input.token,
    p_visiteur_prenom: input.prenom.trim(),
    p_visiteur_nom: input.nom.trim(),
    p_visiteur_email: input.email?.trim() ?? "",
    p_agent_verdict: input.verdict,
  });

  if (error || !data) {
    return {
      ok: false,
      error: "Le signal n’a pas pu être transmis à l’agence.",
    };
  }

  const dossierRef =
    typeof data === "object" &&
    data !== null &&
    "dossier_ref" in data &&
    typeof (data as { dossier_ref: unknown }).dossier_ref === "string"
      ? (data as { dossier_ref: string }).dossier_ref
      : "";

  return { ok: true, dossierRef };
}
