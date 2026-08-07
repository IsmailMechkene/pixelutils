import type { ReactNode } from "react";

interface ToolActionsProps {
  children: ReactNode;
  label?: string;
}

export function ToolActions({
  children,
  label = "Tool actions",
}: ToolActionsProps) {
  return (
    <div
      aria-label={label}
      className="flex flex-wrap items-center gap-1"
      role="group"
    >
      {children}
    </div>
  );
}
