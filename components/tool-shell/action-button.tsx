import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { IconId } from "@/lib/catalog/types";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconId;
  children: ReactNode;
  tone?: "default" | "primary";
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
      ? "border-accent bg-accent text-accent-ink hover:bg-accent-hover"
      : "border-line bg-panel text-ink-muted hover:border-line-strong hover:bg-panel-muted hover:text-ink";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border px-3.5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${toneClass} ${className}`}
      type={type}
      {...props}
    >
      <Icon className="size-4" name={icon} />
      {children}
    </button>
  );
}
