import type { Metadata } from "next";
import Link from "next/link";
import {
  DUREE_CONSERVATION_TRIPTYQUE,
  EMAIL_CONTACT_DPO,
} from "@/lib/legal-copy";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité — Les Clés du Crédit / RUNROC TRIP",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f5efe3_0%,#ebe3d4_100%)]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          Retour à l&apos;accueil
        </Link>

        <h1 className="mt-6 text-2xl font-semibold text-neutral sm:text-3xl">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-neutral-muted">
          Version MVP — à finaliser avec un générateur CNIL ou un legaltech
          avant mise en production.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral">
          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Responsable</h2>
            <p>
              RUNROC TRIP — Les Clés du Crédit. Contact / DPO :{" "}
              <a
                href={`mailto:${EMAIL_CONTACT_DPO}`}
                className="text-brand underline-offset-2 hover:underline"
              >
                {EMAIL_CONTACT_DPO}
              </a>
              .
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Données collectées</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Revenus, charges, apport, situation professionnelle : utilisés
                le temps du calcul, <strong>non conservés</strong>.
              </li>
              <li>
                Identité, référence du bien, indication relative à la visite,
                montants du bien et travaux : conservés pour le suivi du dossier
                par l&apos;agence concernée.
              </li>
              <li>
                Email (si opt-in marketing) : envoi du simulateur personnel et
                informations sur les produits complémentaires — finalité
                distincte, désinscription possible à tout moment.
              </li>
            </ul>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Finalités</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Calcul de la simulation d&apos;indication de visite</li>
              <li>
                Suivi du dossier par l&apos;agence pour le bien concerné
              </li>
              <li>
                Envoi du simulateur offert et informations produits (si
                consentement marketing)
              </li>
            </ul>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Base légale</h2>
            <p>Consentement de la personne concernée.</p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Durées</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Triptyque conservé (identité / bien / indication) :{" "}
                {DUREE_CONSERVATION_TRIPTYQUE}.
              </li>
              <li>Données financières détaillées : aucune conservation.</li>
              <li>
                Liste marketing : 3 ans à compter du dernier contact actif
                (recommandation CNIL), sous réserve de désinscription.
              </li>
            </ul>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Destinataires</h2>
            <p>
              Agence immobilière à l&apos;origine de la demande ; hébergeur et
              prestataires techniques (à venir : Supabase, Stripe, Brevo,
              Vercel) — listés précisément avant mise en production.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Vos droits</h2>
            <p>
              Accès, rectification, effacement, limitation, opposition,
              portabilité. Écrire à{" "}
              <a
                href={`mailto:${EMAIL_CONTACT_DPO}`}
                className="text-brand underline-offset-2 hover:underline"
              >
                {EMAIL_CONTACT_DPO}
              </a>
              . Vous pouvez également introduire une réclamation auprès de la
              CNIL.
            </p>
          </section>
        </div>

        <SiteFooter className="mt-10" />
      </div>
    </div>
  );
}
