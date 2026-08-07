import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { ActionIconId } from "@/lib/icons/types";

interface ToolNoticeProps {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
}

const tones = {
  info: "border-line bg-panel-muted text-ink-muted",
  success: "border-transparent bg-success-soft text-success",
  warning: "border-transparent bg-warning-soft text-warning",
  danger: "border-danger-line bg-danger-soft text-danger",
} as const;

const icons: Record<NonNullable<ToolNoticeProps["tone"]>, ActionIconId> = {
  info: "info",
  success: "circle-check",
  warning: "triangle-alert",
  danger: "triangle-alert",
};

export function ToolNotice({
  children,
  tone = "info",
  title,
}: ToolNoticeProps) {
  return (
    <aside
      className={`flex gap-3 rounded-card border p-4 text-sm leading-6 ${tones[tone]}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" name={icons[tone]} />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </aside>
  );
}
