"use client";

import { useRouter } from "next/navigation";
import { BiensRecents } from "./biens-recents";
import { DashboardSignaux } from "./dashboard-signaux";
import { DureeLocativeForm } from "./duree-locative-form";
import { FicheBienForm } from "./fiche-bien-form";
import type { BienListItem, SignalVisite } from "./actions";

type Props = {
  biens: BienListItem[];
  dureeMaxLocative: number;
  signaux: SignalVisite[];
  simulationsCount: number;
  simulationsQuota: number;
};

export function EspaceAgentClient({
  biens,
  dureeMaxLocative,
  signaux,
  simulationsCount,
  simulationsQuota,
}: Props) {
  const router = useRouter();
  const quotaDepasse = simulationsCount >= simulationsQuota;

  return (
    <div className="space-y-6">
      <section className="rounded-[16px] border border-black/5 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              Signaux de visite
            </h2>
            <p className="mt-1 text-sm text-[var(--neutral-muted)]">
              Même badge que l’acquéreur — sans revenus ni charges.
            </p>
          </div>
          <p className="text-sm tabular-nums text-[var(--neutral-muted)]">
            <span className="text-xl font-semibold text-[var(--brand-main)]">
              {simulationsCount}/{simulationsQuota}
            </span>{" "}
            ce mois-ci
          </p>
        </div>

        {quotaDepasse ? (
          <p className="mt-3 rounded-[12px] border border-[#f0d4b0] bg-[#fdf3e8] px-3.5 py-2.5 text-sm text-[var(--status-orange)]">
            Quota mensuel atteint. Contactez le support pour ajuster votre
            offre — aucun blocage automatique pour le moment.
          </p>
        ) : null}

        <div className="mt-5">
          <DashboardSignaux signaux={signaux} />
        </div>
      </section>

      <section className="rounded-[16px] border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">
          Nouvelle fiche bien
        </h2>
        <p className="mt-1 text-sm text-[var(--neutral-muted)]">
          Remplissez l’essentiel. Le lien généré pourra être renvoyé à plusieurs
          acquéreurs.
        </p>
        <div className="mt-5">
          <FicheBienForm onCreated={() => router.refresh()} />
        </div>
      </section>

      <section className="rounded-[16px] border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Biens récents</h2>
        <p className="mt-1 text-sm text-[var(--neutral-muted)]">
          Retrouvez un bien déjà créé et recopiez son lien en un clic.
        </p>
        <div className="mt-4">
          <BiensRecents biens={biens} />
        </div>
      </section>

      <section className="rounded-[16px] border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">
          Paramètre locatif de marché
        </h2>
        <p className="mt-1 text-sm text-[var(--neutral-muted)]">
          Une fois pour votre secteur — appliqué à tous vos biens en
          investissement locatif.
        </p>
        <div className="mt-4">
          <DureeLocativeForm
            dureeInitiale={dureeMaxLocative}
            onSaved={() => router.refresh()}
          />
        </div>
      </section>
    </div>
  );
}
