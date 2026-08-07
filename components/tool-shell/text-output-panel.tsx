import type { ReactNode } from "react";

interface TextOutputPanelProps {
  id: string;
  label: string;
  value: string;
  description?: string;
  emptyMessage?: string;
  actions?: ReactNode;
  monospace?: boolean;
}

export function TextOutputPanel({
  id,
  label,
  value,
  description,
  emptyMessage = "Your result will appear here.",
  actions,
  monospace = true,
}: TextOutputPanelProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <section className="min-w-0" aria-labelledby={`${id}-label`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink" id={`${id}-label`}>
            {label}
          </h3>
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
        aria-describedby={descriptionId}
        aria-labelledby={`${id}-label`}
        className={`mt-3 min-h-72 w-full resize-y overflow-auto whitespace-pre-wrap break-words rounded-card border border-line-strong bg-canvas px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink-subtle focus:border-accent ${monospace ? "font-mono" : "font-sans"}`}
        id={id}
        placeholder={emptyMessage}
        readOnly
        value={value}
      />
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {value ? `${label} updated.` : ""}
      </p>
    </section>
  );
}
