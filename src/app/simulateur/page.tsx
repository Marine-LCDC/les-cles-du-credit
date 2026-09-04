import Link from "next/link";

export default function SimulateurPlaceholder() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-sable-light px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold text-neutral sm:text-3xl">
        Simulateur
      </h1>
      <p className="mt-3 max-w-md text-neutral-muted">
        En cours de construction (phase 1.2). Revenez bientôt.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[12px] bg-brand px-6 font-medium text-white transition-colors hover:bg-[#266b5c]"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
