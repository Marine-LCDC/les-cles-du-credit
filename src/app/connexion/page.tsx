import type { Metadata } from "next";
import Image from "next/image";
import { ConnexionForm } from "./connexion-form";

export const metadata: Metadata = {
  title: "Connexion agent",
  description: "Accédez à votre espace agent via un lien magique par e-mail.",
};

export default function ConnexionPage() {
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
              Connexion agent
            </h1>
            <p className="mt-2 text-sm text-[var(--neutral-muted)]">
              Pas de mot de passe : recevez un lien magique sur votre e-mail.
            </p>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-black/5 bg-white/80 p-6 shadow-[0_12px_40px_rgba(51,50,46,0.06)] backdrop-blur">
          <ConnexionForm />
        </div>
      </div>
    </main>
  );
}
