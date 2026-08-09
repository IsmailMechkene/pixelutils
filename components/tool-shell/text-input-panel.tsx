import type { ReactNode } from "react";

import { ToolInput } from "./tool-input";

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
    <ToolInput
      actions={actions}
      description={description}
      error={error}
      id={id}
      label={label}
    >
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`mt-3 w-full resize-y rounded-control border bg-canvas px-4 py-3 font-mono text-sm leading-6 text-ink outline-none placeholder:text-ink-subtle focus:border-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? "border-red-500" : "border-line-strong"
        } ${monospace ? "" : "font-sans"}`}
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={!monospace}
        value={value}
      />
    </ToolInput>
  );
}
