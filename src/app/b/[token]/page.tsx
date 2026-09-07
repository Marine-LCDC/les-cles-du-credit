import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  formatEurosFr,
  parseBienPublic,
} from "@/lib/bien-public";

export default async function BienPublicPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_bien_public", {
    p_token: token,
  });

  const bien = !error ? parseBienPublic(data) : null;
  if (!bien) notFound();

  const total =
    bien.prix_acquisition +
    bien.frais_acquisition +
    (bien.travaux_necessaires ? bien.travaux_montant : 0);

  return (
    <main className="relative min-h-full overflow-hidden bg-[linear-gradient(165deg,#f5efe3_0%,#e1f0ec_50%,#ffffff_100%)] text-[var(--neutral-dark)]">
      <div className="relative mx-auto flex min-h-full max-w-lg flex-col justify-center gap-6 px-6 py-16">
        <div>
          <p className="font-heading text-sm font-medium text-[var(--brand-main)]">
            Les Clés du Crédit
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold">
            Estimation avant visite
          </h1>
          <p className="mt-2 text-sm text-[var(--neutral-muted)]">
            Bien à {bien.ville}
            {bien.nom_residence ? ` · ${bien.nom_residence}` : ""} — référence{" "}
            {bien.reference}
          </p>
        </div>

        <section className="rounded-[16px] border border-black/5 bg-white/90 p-5 shadow-[0_12px_40px_rgba(51,50,46,0.06)] backdrop-blur">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--neutral-muted)]">Ville</dt>
              <dd className="font-medium">{bien.ville}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--neutral-muted)]">Référence</dt>
              <dd className="font-medium">{bien.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--neutral-muted)]">Prix</dt>
              <dd className="font-medium tabular-nums">
                {formatEurosFr(bien.prix_acquisition)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--neutral-muted)]">Type</dt>
              <dd className="font-medium">
                {bien.type_bien === "neuf" ? "Neuf" : "Ancien"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--neutral-muted)]">
                Frais d’acquisition
              </dt>
              <dd className="font-medium tabular-nums">
                {formatEurosFr(bien.frais_acquisition)}
              </dd>
            </div>
            {bien.travaux_necessaires ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--neutral-muted)]">Travaux</dt>
                <dd className="font-medium tabular-nums">
                  {formatEurosFr(bien.travaux_montant)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 border-t border-black/5 pt-3">
              <dt className="font-medium">Total estimé</dt>
              <dd className="font-semibold tabular-nums text-[var(--brand-main)]">
                {formatEurosFr(total)}
              </dd>
            </div>
          </dl>
        </section>

        <Link
          href={`/faisabilite?bien=${bien.public_token}`}
          className="inline-flex min-h-11 items-center justify-center rounded-[12px] bg-[var(--brand-main)] px-6 text-base font-medium text-white hover:opacity-95"
        >
          Démarrer ma simulation
        </Link>

        <p className="text-center text-xs text-[var(--neutral-muted)]">
          L’adresse complète n’est pas affichée ici. Estimation indicative —
          ne constitue pas un conseil en crédit.
        </p>
      </div>
    </main>
  );
}
