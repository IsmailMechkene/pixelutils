import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { ActionIconId } from "@/lib/icons/types";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ActionIconId;
  children: ReactNode;
  tone?: "default" | "primary" | "quiet" | "danger";
}

export function ActionButton({
  icon,
  children,
  className = "",
  tone = "default",
  type = "button",
  ...props
}: ActionButtonProps) {
  const toneClass =
    tone === "primary"
      ? "bg-accent text-accent-ink hover:bg-accent-hover"
      : tone === "quiet"
        ? "bg-transparent text-ink-muted hover:bg-panel-muted hover:text-ink"
        : tone === "danger"
          ? "bg-danger-soft text-danger hover:bg-danger-soft/70"
          : "bg-panel-muted text-ink hover:bg-line";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45 ${toneClass} ${className}`}
      type={type}
      {...props}
    >
      {icon ? <Icon className="size-4" name={icon} /> : null}
      {children}
    </button>
  );
}
