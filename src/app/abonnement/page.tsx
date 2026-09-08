import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AbonnementForm } from "./abonnement-form";

export const metadata: Metadata = {
  title: "Abonnement agent",
  description:
    "Souscrivez à Les Clés du Crédit : indication de visite pour vos acquéreurs, 29 €/mois en introduction puis 49 €/mois.",
};

export default function AbonnementPage() {
  return (
    <main className="relative min-h-full overflow-hidden bg-[linear-gradient(165deg,#f5efe3_0%,#e1f0ec_45%,#ffffff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--brand-main)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[var(--accent-sable)]/30 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-full max-w-md flex-col justify-center gap-8 px-6 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/brand/logo.png"
            alt="Les Clés du Crédit"
            width={88}
            height={88}
            priority
            className="h-[88px] w-[88px]"
          />
          <div>
            <p className="font-heading text-2xl font-semibold text-[var(--brand-main)]">
              Les Clés du Crédit
            </p>
            <h1 className="mt-2 font-heading text-xl font-semibold text-[var(--neutral-dark)]">
              Abonnement agent
            </h1>
            <p className="mt-2 text-sm text-[var(--neutral-muted)]">
              Indiquez si une visite vaut le coup — avant le rendez-vous.
            </p>
          </div>
        </div>

        <div className="rounded-[16px] border border-black/5 bg-white/80 p-6 shadow-[0_12px_40px_rgba(51,50,46,0.06)] backdrop-blur">
          <Suspense fallback={<p className="text-sm text-[var(--neutral-muted)]">Chargement…</p>}>
            <AbonnementForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-[var(--neutral-muted)]">
          Déjà abonné ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-[var(--brand-main)] underline-offset-2 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
