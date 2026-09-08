import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paiement confirmé",
  description: "Votre abonnement Les Clés du Crédit est actif.",
};

export default function AbonnementSuccesPage() {
  return (
    <main className="relative flex min-h-full items-center justify-center overflow-hidden bg-[linear-gradient(165deg,#f5efe3_0%,#e1f0ec_45%,#ffffff_100%)] px-6 py-16">
      <div className="w-full max-w-md rounded-[16px] border border-black/5 bg-white/90 p-8 text-center shadow-[0_12px_40px_rgba(51,50,46,0.06)]">
        <p className="font-heading text-lg font-semibold text-[var(--brand-main)]">
          Les Clés du Crédit
        </p>
        <h1 className="mt-3 font-heading text-2xl font-semibold text-[var(--neutral-dark)]">
          Paiement confirmé
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--neutral-muted)]">
          Votre compte agent est en cours d’activation. Connectez-vous avec le
          même e-mail pour accéder à votre espace (un lien magique vous sera
          envoyé).
        </p>
        <Link
          href="/connexion"
          className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-[12px] bg-[var(--brand-main)] px-4 text-base font-medium text-white transition hover:opacity-95"
        >
          Accéder à l’espace agent
        </Link>
      </div>
    </main>
  );
}
