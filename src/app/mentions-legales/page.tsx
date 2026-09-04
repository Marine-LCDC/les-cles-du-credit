import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL_CONTACT_DPO } from "@/lib/legal-copy";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales — Les Clés du Crédit / RUNROC TRIP",
};

export default function MentionsLegalesPage() {
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
          Mentions légales
        </h1>
        <p className="mt-2 text-sm text-neutral-muted">
          À faire relire par un avocat avant mise en ligne définitive.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral">
          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Éditeur</h2>
            <p>
              Le site et l&apos;application « Les Clés du Crédit » sont édités
              par la société <strong>RUNROC TRIP</strong>, SARL au capital de
              500 €, immatriculée au RCS de Saint-Pierre sous le numéro
              930&nbsp;297&nbsp;619&nbsp;00015, dont le siège social est situé
              2 rue Rosette, 97436 Saint-Leu, joignable à{" "}
              <a
                href={`mailto:${EMAIL_CONTACT_DPO}`}
                className="text-brand underline-offset-2 hover:underline"
              >
                {EMAIL_CONTACT_DPO}
              </a>
              .
            </p>
            <p className="mt-3">
              Nom commercial d&apos;exploitation :{" "}
              <strong>Les Clés du Crédit</strong>.
            </p>
            <p className="mt-3">
              Directeur de la publication : Marine CORNU.
            </p>
            <p className="mt-3">
              Hébergeur : OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Activité</h2>
            <p>
              RUNROC TRIP, exploitant le site sous le nom commercial « Les Clés
              du Crédit », édite un logiciel de simulation financière à
              destination des professionnels de l&apos;immobilier et de leurs
              clients. RUNROC TRIP n&apos;est ni un établissement de crédit, ni
              un courtier en opérations de banque, ni un intermédiaire en
              opérations de banque et services de paiement (IOBSP). Les
              simulations produites sont indicatives et ne constituent pas un
              acte de conseil en financement au sens du Code monétaire et
              financier.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus (textes, calculs, mise en forme,
              code) est la propriété de RUNROC TRIP, sauf mention contraire.
            </p>
          </section>

          <section className="rounded-[16px] border border-[#e6dcc8] bg-white px-5 py-5">
            <h2 className="mb-3 text-base font-semibold">Données personnelles</h2>
            <p>
              Voir la{" "}
              <Link
                href="/confidentialite"
                className="text-brand underline-offset-2 hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>
        </div>

        <SiteFooter className="mt-10" />
      </div>
    </div>
  );
}
