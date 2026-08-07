"use client";

import { useToolAnalytics } from "@/components/analytics/tool-analytics-boundary";
import { ActionButton } from "./action-button";

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
  label?: string;
}

export function ResetButton({
  onReset,
  disabled = false,
  label = "Reset",
}: ResetButtonProps) {
  const analytics = useToolAnalytics();
  return (
    <ActionButton
      disabled={disabled}
      icon="rotate-ccw"
      onClick={() => {
        onReset();
        analytics?.action("reset");
      }}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
