import type { ReactNode } from "react";

interface ToolOutputProps {
  id: string;
  label: string;
  children: ReactNode;
  description?: string;
  actions?: ReactNode;
  announcement?: string;
}

export function ToolOutput({
  id,
  label,
  children,
  description,
  actions,
  announcement,
}: ToolOutputProps) {
  return (
    <section aria-labelledby={`${id}-label`} className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink" id={`${id}-label`}>
            {label}
          </h3>
          {description ? (
            <p
              className="mt-1 text-xs leading-5 text-ink-subtle"
              id={`${id}-description`}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
      <p aria-atomic="true" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
