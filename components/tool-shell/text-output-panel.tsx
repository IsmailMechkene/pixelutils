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
  return (
    <section className="min-w-0" aria-labelledby={`${id}-label`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink" id={`${id}-label`}>
            {label}
          </h3>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-ink-subtle">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`mt-3 min-h-72 overflow-auto whitespace-pre-wrap break-words rounded-card border border-line-strong bg-canvas px-4 py-3 text-sm leading-6 ${
          value ? "text-ink" : "text-ink-subtle"
        } ${monospace ? "font-mono" : "font-sans"}`}
        id={id}
        role="status"
        tabIndex={0}
      >
        {value || emptyMessage}
      </div>
    </section>
  );
}
