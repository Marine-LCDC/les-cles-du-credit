import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { AbonnementForm } from "./abonnement-form";

export const metadata: Metadata = {
  title: "Abonnement agent",
  description:
    "Indiquez si une visite vaut le coup avant le rendez-vous. Abonnement agent Les Clés du Crédit : 27 €/mois pendant 3 mois, puis 47 €/mois.",
};

const STEPS = [
  {
    title: "Créez la fiche du bien",
    text: "Prix, travaux, type ancien ou neuf. L’adresse reste interne à votre agence.",
  },
  {
    title: "Partagez un seul lien",
    text: "Un lien réutilisable par bien, à envoyer à chaque personne intéressée.",
  },
  {
    title: "Recevez le même signal",
    text: "Visite recommandée, possible ou peu conseillée — sans voir les finances du client.",
  },
] as const;

const BENEFITS = [
  {
    title: "Moins de visites sans suite",
    text: "Vous priorisez les rendez-vous quand le projet tient la route pour ce bien.",
  },
  {
    title: "Clarté pour l’acquéreur",
    text: "Un résultat à l’écran, factuel, sans jargon bancaire intimidant.",
  },
  {
    title: "Données financières non stockées",
    text: "Revenus et charges servent au calcul, puis ne sont pas conservés.",
  },
] as const;

export default function AbonnementPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(180deg,#f5efe3_0%,#ebe3d4_55%,#e1f0ec_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%333322E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-[40%] h-72 w-72 rounded-full bg-sable/25 blur-3xl"
      />

      {/* Hero */}
      <header className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-10 pt-16 text-center sm:pb-12 sm:pt-20">
        <div className="animate-fade-up mb-8 flex h-36 w-36 items-center justify-center overflow-hidden rounded-[16px] bg-neutral shadow-sm sm:h-44 sm:w-44">
          <Image
            src="/brand/logo.png"
            alt="Les Clés du Crédit"
            width={176}
            height={176}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <p className="animate-fade-up font-heading text-sm font-medium tracking-wide text-brand [animation-delay:80ms]">
          Les Clés du Crédit
        </p>

        <h1 className="animate-fade-up mt-3 max-w-xl font-heading text-3xl font-semibold leading-tight text-neutral sm:text-4xl [animation-delay:140ms]">
          Sachez si une visite vaut le coup — avant le rendez-vous
        </h1>

        <p className="animate-fade-up mt-4 max-w-md text-base text-neutral-muted sm:text-lg [animation-delay:200ms]">
          Vos acquéreurs simulent le bien. Vous recevez le même signal de
          visite, sans accéder à leurs finances.
        </p>

        <div className="animate-fade-up mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center [animation-delay:260ms]">
          <a
            href="#souscrire"
            className="inline-flex min-h-11 items-center justify-center rounded-[12px] bg-brand px-6 text-base font-medium text-white transition-colors hover:bg-[#266b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Commencer l’abonnement
          </a>
          <Link
            href="/connexion"
            className="inline-flex min-h-11 items-center justify-center rounded-[12px] border border-sable/60 bg-white/60 px-6 text-base font-medium text-neutral backdrop-blur-sm transition-colors hover:bg-white"
          >
            Se connecter
          </Link>
        </div>

        <p className="animate-fade-up mt-6 text-sm text-neutral-muted [animation-delay:320ms]">
          27 €/mois pendant 3 mois · puis 47 €/mois
        </p>
      </header>

      <main className="relative z-10">
        {/* Parcours */}
        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="text-center font-heading text-2xl font-semibold text-neutral sm:text-3xl">
            Comment ça fonctionne
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-neutral-muted">
            Trois gestes. Pas de PDF. Un signal clair dans votre tableau de
            bord.
          </p>

          <ol className="mt-12 space-y-10">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-neutral">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-neutral-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Bénéfices */}
        <section className="border-y border-sable/40 bg-white/40 px-6 py-16 backdrop-blur-sm sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-heading text-2xl font-semibold text-neutral sm:text-3xl">
              Ce que vous gagnez
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-neutral-muted">
              Un filtre opérationnel avant d’ouvrir l’agenda — pas un avis
              bancaire.
            </p>

            <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {BENEFITS.map((item) => (
                <li key={item.title}>
                  <h3 className="font-heading text-base font-semibold text-neutral">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-muted">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tarif + checkout */}
        <section
          id="souscrire"
          className="mx-auto max-w-lg scroll-mt-8 px-6 py-16 sm:py-20"
        >
          <div className="text-center">
            <h2 className="font-heading text-2xl font-semibold text-neutral sm:text-3xl">
              Abonnement agent
            </h2>
            <p className="mt-3 text-neutral-muted">
              Un siège. 40 simulations visiteurs / mois. Résiliation à tout
              moment côté Stripe.
            </p>
          </div>

          <div className="mt-8 rounded-[16px] border border-black/5 bg-white/85 p-6 shadow-[0_12px_40px_rgba(51,50,46,0.06)] backdrop-blur">
            <p className="font-heading text-3xl font-semibold text-neutral">
              27 €
              <span className="text-lg font-medium text-neutral-muted">
                {" "}
                / mois
              </span>
            </p>
            <p className="mt-1 text-sm text-neutral-muted">
              3 premiers mois, puis{" "}
              <span className="font-medium text-neutral">47 € / mois</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm text-neutral-muted">
              <li>· Fiches biens et liens réutilisables</li>
              <li>· Dashboard avec le même badge que l’acquéreur</li>
              <li>· 40 simulations visiteurs / mois incluses</li>
              <li>· Accès immédiat après paiement confirmé</li>
            </ul>

            <div className="mt-6 border-t border-black/5 pt-6">
              <Suspense
                fallback={
                  <p className="text-sm text-neutral-muted">Chargement…</p>
                }
              >
                <AbonnementForm />
              </Suspense>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-muted">
            Déjà abonné ?{" "}
            <Link
              href="/connexion"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter className="relative z-10" />
    </div>
  );
}
