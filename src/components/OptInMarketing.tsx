"use client";

import { useState } from "react";
import {
  OPTIN_MARKETING_CHECKBOX_LABEL,
  OPTIN_MARKETING_DETAIL,
} from "@/lib/legal-copy";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

/** Case marketing courte + détail dépliable (indépendante du résultat). */
export function OptInMarketing({ checked, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-neutral-muted">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#e6dcc8] accent-brand"
        />
        <span>
          {OPTIN_MARKETING_CHECKBOX_LABEL}{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpen((v) => !v);
            }}
            className="font-medium text-brand underline-offset-2 hover:underline"
            aria-expanded={open}
          >
            {open ? "Masquer le détail" : "Voir le détail"}
          </button>
        </span>
      </label>
      {open ? (
        <p className="mt-2 rounded-[8px] bg-[#faf6ee] px-3 py-2 text-[11px] leading-relaxed text-neutral-muted">
          {OPTIN_MARKETING_DETAIL}
        </p>
      ) : null}
    </div>
  );
}
