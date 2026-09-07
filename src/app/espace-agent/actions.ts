"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TypeBien } from "@/lib/supabase/database.types";

export type BienListItem = {
  id: string;
  public_token: string;
  reference: string;
  ville: string;
  prix_acquisition: number;
  type_bien: TypeBien;
  created_at: string;
};

export type CreateBienInput = {
  reference: string;
  nomResidence: string;
  adresseComplete: string;
  ville: string;
  prixAcquisition: number;
  typeBien: TypeBien;
  fraisAcquisition: number;
  travauxNecessaires: boolean;
  travauxMontant: number;
};

export type CreateBienResult =
  | { ok: true; token: string; id: string }
  | { ok: false; error: string };

function parseMoney(value: number): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}

export async function createBien(
  input: CreateBienInput,
): Promise<CreateBienResult> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { ok: false, error: "Session expirée. Reconnectez-vous." };
  }

  const agentId = claimsData.claims.sub;
  const reference = input.reference.trim();
  const ville = input.ville.trim();
  const adresseComplete = input.adresseComplete.trim();
  const nomResidence = input.nomResidence.trim();

  if (!reference) return { ok: false, error: "Indiquez une référence." };
  if (!ville) return { ok: false, error: "Indiquez la ville." };
  if (!adresseComplete) {
    return { ok: false, error: "Indiquez l’adresse complète (usage interne)." };
  }

  const prix = parseMoney(input.prixAcquisition);
  if (prix === null) {
    return { ok: false, error: "Le prix d’acquisition doit être positif." };
  }

  if (input.typeBien !== "ancien" && input.typeBien !== "neuf") {
    return { ok: false, error: "Choisissez ancien ou neuf." };
  }

  if (!Number.isFinite(input.fraisAcquisition) || input.fraisAcquisition < 0) {
    return { ok: false, error: "Les frais d’acquisition sont invalides." };
  }

  const travauxMontant = input.travauxNecessaires
    ? Math.max(0, Math.round(input.travauxMontant || 0))
    : 0;

  if (input.travauxNecessaires && travauxMontant <= 0) {
    return {
      ok: false,
      error: "Indiquez le montant des travaux, ou désactivez l’option.",
    };
  }

  const { data, error } = await supabase
    .from("biens")
    .insert({
      agent_id: agentId,
      reference,
      nom_residence: nomResidence || null,
      adresse_complete: adresseComplete,
      ville,
      prix_acquisition: prix,
      type_bien: input.typeBien,
      frais_acquisition: Math.round(input.fraisAcquisition),
      travaux_necessaires: input.travauxNecessaires,
      travaux_montant: travauxMontant,
    })
    .select("id, public_token")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: "Enregistrement impossible. Réessayez dans un instant.",
    };
  }

  revalidatePath("/espace-agent");
  return { ok: true, token: data.public_token, id: data.id };
}

export async function listBiensRecents(): Promise<BienListItem[]> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) return [];

  const { data } = await supabase
    .from("biens")
    .select(
      "id, public_token, reference, ville, prix_acquisition, type_bien, created_at",
    )
    .eq("agent_id", claimsData.claims.sub)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).map((row) => ({
    ...row,
    prix_acquisition: Number(row.prix_acquisition),
  }));
}

export type SignalVisite = {
  id: string;
  dossier_ref: string;
  visiteur_prenom: string;
  visiteur_nom: string;
  agent_verdict: "vert" | "orange" | "rouge";
  created_at: string;
  bien_reference: string;
  bien_ville: string;
};

export async function listSignauxVisite(): Promise<SignalVisite[]> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) return [];

  const { data } = await supabase
    .from("simulations")
    .select(
      "id, dossier_ref, visiteur_prenom, visiteur_nom, agent_verdict, created_at, biens ( reference, ville )",
    )
    .eq("agent_id", claimsData.claims.sub)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!data) return [];

  return data.flatMap((row) => {
    if (
      row.agent_verdict !== "vert" &&
      row.agent_verdict !== "orange" &&
      row.agent_verdict !== "rouge"
    ) {
      return [];
    }

    const bienRaw = row.biens;
    const bien = Array.isArray(bienRaw) ? bienRaw[0] : bienRaw;
    if (
      !bien ||
      typeof bien !== "object" ||
      typeof (bien as { reference?: unknown }).reference !== "string" ||
      typeof (bien as { ville?: unknown }).ville !== "string"
    ) {
      return [];
    }

    return [
      {
        id: row.id,
        dossier_ref: row.dossier_ref,
        visiteur_prenom: row.visiteur_prenom,
        visiteur_nom: row.visiteur_nom,
        agent_verdict: row.agent_verdict,
        created_at: row.created_at,
        bien_reference: (bien as { reference: string }).reference,
        bien_ville: (bien as { ville: string }).ville,
      },
    ];
  });
}

export type UpdateDureeLocativeResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateDureeMaxLocative(
  dureeAnnees: number,
): Promise<UpdateDureeLocativeResult> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { ok: false, error: "Session expirée. Reconnectez-vous." };
  }

  if (
    !Number.isInteger(dureeAnnees) ||
    dureeAnnees < 15 ||
    dureeAnnees > 30
  ) {
    return {
      ok: false,
      error: "Indiquez une durée entre 15 et 30 ans.",
    };
  }

  const { error } = await supabase
    .from("agents")
    .update({ duree_max_locative_marche: dureeAnnees })
    .eq("id", claimsData.claims.sub);

  if (error) {
    return {
      ok: false,
      error: "Enregistrement impossible. Réessayez dans un instant.",
    };
  }

  revalidatePath("/espace-agent");
  return { ok: true };
}
