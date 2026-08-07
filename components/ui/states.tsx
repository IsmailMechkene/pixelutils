import type { ReactNode } from "react";

import { Icon } from "./icon";
import type { ActionIconId } from "@/lib/icons/types";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ActionIconId;
}

export function EmptyState({
  title,
  description,
  action,
  icon = "search",
}: EmptyStateProps) {
  return (
    <div className="px-4 py-8 text-center">
      <Icon className="mx-auto size-5 text-ink-subtle" name={icon} />
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-ink-subtle">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="h-64 animate-pulse rounded-card bg-panel-muted motion-reduce:animate-none"
      role="status"
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}
