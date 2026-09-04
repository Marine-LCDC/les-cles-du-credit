import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      {/* Atmosphere — dégradé sable → teal discret */}
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
        <div className="mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-[16px] bg-neutral shadow-sm sm:h-40 sm:w-40">
          <Image
            src="/brand/logo.png"
            alt="Les Clés du Crédit"
            width={160}
            height={160}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <p className="mb-3 font-heading text-sm font-medium tracking-wide text-brand">
          Les Clés du Crédit
        </p>

        <h1 className="max-w-xl text-3xl font-semibold leading-tight text-neutral sm:text-4xl">
          Voyons ensemble si ce projet tient la route
        </h1>

        <p className="mt-4 max-w-md text-base text-neutral-muted sm:text-lg">
          Une estimation claire avant la visite — pour l’acquéreur comme pour
          l’agent.
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href="/simulateur"
            className="inline-flex min-h-11 items-center justify-center rounded-[12px] bg-brand px-6 text-base font-medium text-white transition-colors hover:bg-[#266b5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Essayer le simulateur
          </Link>
          <span className="inline-flex min-h-11 items-center justify-center rounded-[12px] border border-sable/60 bg-white/60 px-6 text-base font-medium text-neutral-muted backdrop-blur-sm">
            Espace agent — bientôt
          </span>
        </div>
      </main>

      <footer className="relative z-10 pb-8 text-center text-sm text-neutral-muted">
        Estimation indicative — ne constitue pas un conseil en crédit
      </footer>
    </div>
  );
}
