import type { SignalVisite } from "./actions";

const VERDICT_UI = {
  vert: {
    badge: "Visite recommandée",
    dot: "bg-[var(--status-green)]",
    box: "border-[#b9dfc0] bg-[#e7f3ea]",
    label: "text-[var(--status-green)]",
  },
  orange: {
    badge: "Visite possible",
    dot: "bg-[var(--status-orange)]",
    box: "border-[#f0d4b0] bg-[#fdf3e8]",
    label: "text-[var(--status-orange)]",
  },
  rouge: {
    badge: "Visite peu conseillée",
    dot: "bg-[var(--status-red)]",
    box: "border-[#f0c4c4] bg-[#fbebeb]",
    label: "text-[var(--status-red)]",
  },
} as const;

function formatDateHeure(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

type Props = {
  signaux: SignalVisite[];
};

export function DashboardSignaux({ signaux }: Props) {
  if (signaux.length === 0) {
    return (
      <p className="text-sm text-[var(--neutral-muted)]">
        Aucun signal pour l’instant. Dès qu’un acquéreur termine une simulation
        via votre lien, le badge apparaît ici — sans détail financier.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/5">
      {signaux.map((signal) => {
        const ui = VERDICT_UI[signal.agent_verdict];
        return (
          <li key={signal.id} className="py-4 first:pt-0 last:pb-0">
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-[12px] border px-3 py-2 ${ui.box}`}
            >
              <span
                aria-hidden
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${ui.dot}`}
              />
              <span className={`text-sm font-semibold ${ui.label}`}>
                {ui.badge}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <div>
                <p className="font-medium text-[var(--neutral-dark)]">
                  {signal.visiteur_prenom} {signal.visiteur_nom}
                </p>
                <p className="text-sm text-[var(--neutral-muted)]">
                  Réf. {signal.bien_reference} · {signal.bien_ville}
                </p>
              </div>
              <div className="text-xs text-[var(--neutral-muted)] sm:text-right">
                <p>{formatDateHeure(signal.created_at)}</p>
                <p className="mt-0.5">{signal.dossier_ref}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
