"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ConnexionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    const supabase = createClient();
    const origin = window.location.origin;
    const next =
      new URLSearchParams(window.location.search).get("next") ??
      "/espace-agent";

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setMessage("Impossible d’envoyer le lien. Réessayez dans un instant.");
      return;
    }

    setStatus("sent");
    setMessage(
      "Un lien de connexion vient de vous être envoyé. Ouvrez votre boîte mail.",
    );
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
          className="min-h-11 rounded-[var(--radius-md)] border border-black/10 bg-white px-3 text-base text-[var(--neutral-dark)] outline-none ring-[var(--brand-main)] focus:ring-2"
          placeholder="vous@agence.fr"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="min-h-11 rounded-[var(--radius-md)] bg-[var(--brand-main)] px-4 text-base font-medium text-white transition hover:opacity-95 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi…" : "Recevoir mon lien de connexion"}
      </button>

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
