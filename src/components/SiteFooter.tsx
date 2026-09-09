import Link from "next/link";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`pb-8 pt-4 text-center text-xs leading-relaxed text-neutral-muted ${className}`}
    >
      <p className="mb-2">
        Estimation indicative — ne constitue pas un conseil en crédit
      </p>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <Link
          href="/mentions-legales"
          className="text-brand underline-offset-2 hover:underline"
        >
          Mentions légales
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/confidentialite"
          className="text-brand underline-offset-2 hover:underline"
        >
          Confidentialité
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/cgu"
          className="text-brand underline-offset-2 hover:underline"
        >
          CGU agents
        </Link>
        <span aria-hidden>·</span>
        <Link
          href="/connexion"
          className="text-brand underline-offset-2 hover:underline"
        >
          Espace agent
        </Link>
      </p>
    </footer>
  );
}
