"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  frenchVatFromSiren,
  normalizeFrenchVat,
  normalizeSiret,
} from "@/lib/billing/company-info";

const inputClassName =
  "min-h-11 rounded-[12px] border border-black/10 bg-white px-3 text-base text-[var(--neutral-dark)] outline-none focus:border-[var(--brand-main)] focus:ring-2 focus:ring-[var(--brand-main)]/20";

export function AbonnementForm() {
  const searchParams = useSearchParams();
  const annule = searchParams.get("annule") === "1";
  const accesRefuse = searchParams.get("acces") === "1";

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [siret, setSiret] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [vatTouched, setVatTouched] = useState(false);
  const [accepteCgu, setAccepteCgu] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(
    accesRefuse
      ? "Votre abonnement n’est pas actif. Souscrivez ou mettez à jour votre paiement pour accéder à l’espace agent."
      : annule
        ? "Paiement annulé. Vous pouvez relancer quand vous êtes prêt."
        : null,
  );

  function onSiretChange(raw: string) {
    const digits = normalizeSiret(raw).slice(0, 14);
    const formatted =
      digits.length > 9
        ? `${digits.slice(0, 9)} ${digits.slice(9)}`
        : digits;
    setSiret(formatted);

    if (!vatTouched && digits.length === 14) {
      try {
        setVatNumber(frenchVatFromSiren(digits.slice(0, 9)));
      } catch {
        /* ignore */
      }
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepteCgu) {
      setStatus("error");
      setMessage("Acceptez les conditions générales pour continuer.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          companyName: companyName.trim(),
          addressLine1: addressLine1.trim(),
          postalCode: postalCode.trim(),
          city: city.trim(),
          siret: normalizeSiret(siret),
          vatNumber: normalizeFrenchVat(vatNumber),
        }),
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
      <p className="text-sm text-[var(--neutral-muted)]">
        Informations de facturation (agence / société)
      </p>

      <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
        Raison sociale
        <input
          type="text"
          name="companyName"
          required
          autoComplete="organization"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={inputClassName}
          placeholder="Agence Immobilière Exemple"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
        Adresse e-mail professionnelle
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          placeholder="vous@agence.fr"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
        Adresse de facturation
        <input
          type="text"
          name="addressLine1"
          required
          autoComplete="street-address"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          className={inputClassName}
          placeholder="12 rue du Commerce"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[7.5rem_1fr]">
        <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
          Code postal
          <input
            type="text"
            name="postalCode"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={postalCode}
            onChange={(e) =>
              setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            className={inputClassName}
            placeholder="97400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
          Ville
          <input
            type="text"
            name="city"
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClassName}
            placeholder="Saint-Denis"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
        SIRET
        <input
          type="text"
          name="siret"
          required
          inputMode="numeric"
          autoComplete="off"
          value={siret}
          onChange={(e) => onSiretChange(e.target.value)}
          className={inputClassName}
          placeholder="123 456 789 00012"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-[var(--neutral-muted)]">
        N° de TVA intracommunautaire
        <input
          type="text"
          name="vatNumber"
          required
          autoComplete="off"
          value={vatNumber}
          onChange={(e) => {
            setVatTouched(true);
            setVatNumber(normalizeFrenchVat(e.target.value).slice(0, 13));
          }}
          className={inputClassName}
          placeholder="FR12345678901"
        />
        <span className="text-xs text-[var(--neutral-muted)]">
          Prérempli à partir du SIRET — vérifiez-le avant de payer.
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--neutral-muted)]">
        <input
          type="checkbox"
          checked={accepteCgu}
          onChange={(e) => setAccepteCgu(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-black/20 accent-[var(--brand-main)]"
        />
        <span>
          J’accepte les{" "}
          <Link
            href="/cgu"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--brand-main)] underline-offset-2 hover:underline"
          >
            conditions générales
          </Link>{" "}
          de l’abonnement agent.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="min-h-11 rounded-[12px] bg-[var(--brand-main)] px-4 text-base font-medium text-white transition hover:opacity-95 disabled:opacity-60"
      >
        {status === "loading"
          ? "Redirection vers Stripe…"
          : "S’abonner — 27 € / mois"}
      </button>

      <p className="text-xs leading-relaxed text-[var(--neutral-muted)]">
        3 premiers mois à 27 €, puis 47 € / mois. Paiement sécurisé via Stripe.
        Vous pourrez vous connecter à l’espace agent dès que le paiement est
        confirmé.
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
