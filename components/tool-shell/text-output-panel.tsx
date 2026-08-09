import type { ReactNode } from "react";

import { ToolOutput } from "./tool-output";

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
    <ToolOutput
      actions={actions}
      announcement={value ? `${label} updated.` : ""}
      description={description}
      id={id}
      label={label}
    >
      <textarea
        aria-describedby={descriptionId}
        aria-labelledby={`${id}-label`}
        className={`mt-3 min-h-72 w-full resize-y overflow-auto whitespace-pre-wrap break-words rounded-control border border-line-strong bg-canvas px-4 py-3 font-mono text-sm leading-6 text-ink outline-none placeholder:text-ink-subtle focus:border-accent ${monospace ? "" : "font-sans"}`}
        id={id}
        placeholder={emptyMessage}
        readOnly
        value={value}
      />
    </ToolOutput>
  );
}
