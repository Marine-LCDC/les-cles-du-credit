import Link from "next/link";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`pb-8 pt-4 text-center text-xs leading-relaxed text-neutral-muted ${className}`}
    >
      <p className="mb-2">
        Estimation indicative — ne constitue pas un conseil en crédit
      </p>
      <p>
        <Link
          href="/mentions-legales"
          className="text-brand underline-offset-2 hover:underline"
        >
          Mentions légales
        </Link>
        {" · "}
        <Link
          href="/confidentialite"
          className="text-brand underline-offset-2 hover:underline"
        >
          Confidentialité
        </Link>
      </p>
    </footer>
  );
}
