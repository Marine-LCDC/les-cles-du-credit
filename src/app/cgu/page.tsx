import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL_CONTACT_DPO } from "@/lib/legal-copy";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Conditions générales (agents)",
  description:
    "Conditions générales d’utilisation et de vente — abonnement agent Les Clés du Crédit / RUNROC TRIP",
};

export default function CguPage() {
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
          Conditions générales — agents
        </h1>
        <p className="mt-2 text-sm text-neutral-muted">
          Version MVP — à faire relire par un avocat avant mise en production.
          Ces conditions s&apos;appliquent à l&apos;abonnement professionnel
          destiné aux agents immobiliers.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral">
          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">1. Éditeur</h2>
            <p>
              Le service « Les Clés du Crédit » est édité par{" "}
              <strong>RUNROC TRIP</strong>, SARL au capital de 500 €, RCS
              Saint-Pierre 930&nbsp;297&nbsp;619&nbsp;00015, 2 rue Rosette,
              97436 Saint-Leu. Contact :{" "}
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
            <h2 className="mb-3 text-base font-semibold">2. Objet</h2>
            <p>
              Les présentes conditions régissent l&apos;accès à l&apos;outil
              d&apos;aide à la pré-qualification proposé aux professionnels de
              l&apos;immobilier : création de fiches biens, liens visiteurs,
              simulations d&apos;indication de visite et tableau de bord agent.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">
              3. Abonnement et prix
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Abonnement mensuel récurrent, facturé via Stripe (paiement
                sécurisé).
              </li>
              <li>
                Tarif d&apos;introduction : <strong>27 € TTC / mois</strong>{" "}
                pendant 3 mois, puis <strong>47 € TTC / mois</strong> en régime
                (affichés avant paiement).
              </li>
              <li>
                Un siège (un compte agent). Quota de{" "}
                <strong>40 simulations visiteurs / mois</strong> inclus ; en cas
                de dépassement, contactez-nous.
              </li>
              <li>
                Accès activé dès confirmation du paiement (livraison numérique
                immédiate).
              </li>
            </ul>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">
              4. Compte et usage
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                L&apos;accès est personnel : pas de partage de compte entre
                plusieurs personnes.
              </li>
              <li>
                L&apos;agent s&apos;engage à utiliser le service dans le cadre
                de son activité professionnelle et à respecter le RGPD vis-à-vis
                des visiteurs qu&apos;il oriente vers l&apos;outil.
              </li>
              <li>
                L&apos;adresse complète d&apos;un bien reste à usage interne
                agent ; seuls la ville et la référence sont montrés au
                visiteur.
              </li>
            </ul>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">
              5. Nature des résultats
            </h2>
            <p>
              Les Clés du Crédit fournit un outil d&apos;aide à la
              pré-qualification à destination des professionnels de
              l&apos;immobilier. L&apos;agent reconnaît que les résultats
              produits sont indicatifs, ne dispensent pas de vérifications
              complémentaires auprès d&apos;un établissement bancaire ou
              d&apos;un courtier habilité, et ne sauraient engager la
              responsabilité de Les Clés du Crédit en cas de refus de
              financement ultérieur, quel que soit le résultat affiché par
              l&apos;outil.
            </p>
            <p className="mt-3">
              RUNROC TRIP n&apos;est ni un établissement de crédit, ni un
              IOBSP, ni un courtier en crédit.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">
              6. Résiliation et paiement
            </h2>
            <p>
              L&apos;abonnement se renouvelle automatiquement chaque mois. Vous
              pouvez le résilier à tout moment via le portail de facturation
              Stripe ou en écrivant à {EMAIL_CONTACT_DPO}. La résiliation prend
              effet à la fin de la période déjà payée. Les sommes dues pour la
              période en cours restent exigibles.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">
              7. Données personnelles
            </h2>
            <p>
              Le traitement des données est décrit dans la{" "}
              <Link
                href="/confidentialite"
                className="text-brand underline-offset-2 hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">8. Contact</h2>
            <p>
              Pour toute question relative au service ou à ces conditions :{" "}
              <a
                href={`mailto:${EMAIL_CONTACT_DPO}`}
                className="text-brand underline-offset-2 hover:underline"
              >
                {EMAIL_CONTACT_DPO}
              </a>
              .
            </p>
          </section>
        </div>

        <SiteFooter className="mt-10" />
      </div>
    </div>
  );
}
