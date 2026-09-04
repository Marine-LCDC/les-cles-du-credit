import type { ReactNode } from "react";

const inputClass =
  "w-full min-h-11 rounded-[12px] border border-[#e6dcc8] bg-white px-3.5 text-base text-neutral outline-none transition-colors placeholder:text-neutral-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

const labelClass = "mb-1.5 block text-sm font-medium text-neutral";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-neutral-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-xs text-status-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  inputMode = "decimal",
  suffix = "€",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "numeric";
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-10`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-muted">
        {suffix}
      </span>
    </div>
  );
}

export function MoneyField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        suffix={suffix}
      />
    </Field>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  type?: "text" | "email";
  autoComplete?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ChoiceCards<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
}) {
  return (
    <fieldset className="mb-4">
      <legend className={labelClass}>{label}</legend>
      <div className="grid gap-2">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`min-h-11 rounded-[12px] border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-brand bg-brand-light text-neutral"
                  : "border-[#e6dcc8] bg-white text-neutral hover:border-brand/40"
              }`}
            >
              <span className="block text-sm font-medium">{o.label}</span>
              {o.hint ? (
                <span className="mt-0.5 block text-xs text-neutral-muted">
                  {o.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex w-full min-h-11 items-center justify-between gap-3 rounded-[12px] border border-[#e6dcc8] bg-white px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm font-medium text-neutral">{label}</span>
          {hint ? (
            <span className="mt-0.5 block text-xs text-neutral-muted">{hint}</span>
          ) : null}
        </span>
        <span
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            checked ? "bg-brand" : "bg-[#d9d2c4]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-5" : ""
            }`}
          />
        </span>
      </button>
    </div>
  );
}

export function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 rounded-[12px] border border-sable/50 bg-[#faf6ee] px-3.5 py-3 text-sm text-neutral-muted leading-relaxed">
      {children}
    </div>
  );
}

export { inputClass };
