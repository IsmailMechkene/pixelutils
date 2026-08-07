import type { ReactNode } from "react";

import { ErrorMessage } from "./error-message";

interface ToolInputProps {
  id: string;
  label: string;
  children: ReactNode;
  description?: string;
  error?: string;
  actions?: ReactNode;
}

export function ToolInput({
  id,
  label,
  children,
  description,
  error,
  actions,
}: ToolInputProps) {
  return (
    <section aria-labelledby={`${id}-label`} className="min-w-0">
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
              id={`${id}-description`}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
      {error ? (
        <div className="mt-3">
          <ErrorMessage id={`${id}-error`} message={error} />
        </div>
      ) : null}
    </section>
  );
}
