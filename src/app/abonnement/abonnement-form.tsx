"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function AbonnementForm() {
  const searchParams = useSearchParams();
  const annule = searchParams.get("annule") === "1";
  const accesRefuse = searchParams.get("acces") === "1";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(
    accesRefuse
      ? "Votre abonnement n’est pas actif. Souscrivez ou mettez à jour votre paiement pour accéder à l’espace agent."
      : annule
        ? "Paiement annulé. Vous pouvez relancer quand vous êtes prêt."
        : null,
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setStatus("error");
        setMessage(data.error ?? "Impossible de démarrer le paiement.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
      setMessage("Erreur réseau. Réessayez dans un instant.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
        Adresse e-mail professionnelle
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 rounded-[12px] border border-black/10 bg-white px-3 text-base text-[var(--neutral-dark)] outline-none focus:border-[var(--brand-main)] focus:ring-2 focus:ring-[var(--brand-main)]/20"
          placeholder="vous@agence.fr"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="min-h-11 rounded-[12px] bg-[var(--brand-main)] px-4 text-base font-medium text-white transition hover:opacity-95 disabled:opacity-60"
      >
        {status === "loading"
          ? "Redirection vers Stripe…"
          : "S’abonner — 29 € / mois"}
      </button>

      <p className="text-xs leading-relaxed text-[var(--neutral-muted)]">
        Puis 49 € / mois après la période d’introduction. Paiement sécurisé via
        Stripe. Vous pourrez vous connecter à l’espace agent dès que le paiement
        est confirmé.
      </p>

      {message ? (
        <p
          role="status"
          className={`text-sm ${
            status === "error"
              ? "text-[var(--status-red)]"
              : "text-[var(--neutral-muted)]"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
