import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#e1f0ec_0%,transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(199,169,122,0.35)_0%,transparent_45%),linear-gradient(180deg,#f5efe3_0%,#ebe3d4_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%333322E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
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

        <p className="animate-fade-up font-heading text-base font-semibold tracking-wide text-brand sm:text-lg [animation-delay:80ms]">
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
          <Link
            href="/abonnement"
            className="inline-flex min-h-11 items-center justify-center rounded-[12px] bg-brand px-6 text-base font-medium text-white transition-colors hover:bg-[#266b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Découvrir l’abonnement
          </Link>
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
      </main>

      <SiteFooter className="relative z-10" />
    </div>
  );
}
