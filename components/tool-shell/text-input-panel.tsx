import type { ReactNode } from "react";

import { ErrorMessage } from "./error-message";

interface TextInputPanelProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  error?: string;
  placeholder?: string;
  actions?: ReactNode;
  disabled?: boolean;
  rows?: number;
  monospace?: boolean;
}

export function TextInputPanel({
  id,
  label,
  value,
  onChange,
  description,
  error,
  placeholder,
  actions,
  disabled = false,
  rows = 12,
  monospace = true,
}: TextInputPanelProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <section className="min-w-0" aria-labelledby={`${id}-label`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <label
            className="text-sm font-semibold text-ink"
            htmlFor={id}
            id={`${id}-label`}
          >
            {label}
          </label>
          {description ? (
            <p
              className="mt-1 text-xs leading-5 text-ink-subtle"
              id={descriptionId}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`mt-3 w-full resize-y rounded-card border bg-canvas px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink-subtle focus:border-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? "border-red-500" : "border-line-strong"
        } ${monospace ? "font-mono" : "font-sans"}`}
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={!monospace}
        value={value}
      />
      {error ? (
        <div className="mt-3">
          <ErrorMessage id={errorId} message={error} />
        </div>
      ) : null}
    </section>
  );
}
