import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listBiensRecents, listSignauxVisite } from "./actions";
import { EspaceAgentClient } from "./espace-agent-client";

type CompteurMois = { count: number; quota: number };

function parseCompteur(value: unknown): CompteurMois | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.count !== "number" || typeof record.quota !== "number") {
    return null;
  }
  return { count: record.count, quota: record.quota };
}

export default async function EspaceAgentPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/connexion");
  }

  const email =
    typeof data.claims.email === "string" ? data.claims.email : "Agent";

  const { data: agent } = await supabase
    .from("agents")
    .select("email, duree_max_locative_marche, simulations_quota_mensuel")
    .eq("id", data.claims.sub)
    .maybeSingle();

  const { data: compteurRaw } = await supabase.rpc("compteur_simulations_mois");
  const compteur = parseCompteur(compteurRaw);
  const count = compteur?.count ?? 0;
  const quota = compteur?.quota ?? agent?.simulations_quota_mensuel ?? 50;
  const [biens, signaux] = await Promise.all([
    listBiensRecents(),
    listSignauxVisite(),
  ]);

  return (
    <main className="min-h-full bg-[#f7f7f5] text-[var(--neutral-dark)]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-heading text-lg font-semibold text-[var(--brand-main)]">
              Les Clés du Crédit
            </p>
            <p className="text-sm text-[var(--neutral-muted)]">Espace agent</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="min-h-11 rounded-[12px] border border-black/10 bg-white px-4 text-sm font-medium hover:bg-black/[0.02]"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8 sm:py-10">
        <section>
          <h1 className="font-heading text-2xl font-semibold">
            Bonjour, {agent?.email ?? email}
          </h1>
          <p className="mt-2 text-sm text-[var(--neutral-muted)]">
            Suivez les indications de visite, créez vos fiches biens et partagez
            les liens.
          </p>
        </section>

        <EspaceAgentClient
          biens={biens}
          dureeMaxLocative={agent?.duree_max_locative_marche ?? 25}
          signaux={signaux}
          simulationsCount={count}
          simulationsQuota={quota}
        />
      </div>
    </main>
  );
}
