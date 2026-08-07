"use client";

import { useToolAnalytics } from "@/components/analytics/tool-analytics-boundary";
import { ActionButton } from "./action-button";

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
}

export function ClearButton({
  onClear,
  disabled = false,
  label = "Clear",
}: ClearButtonProps) {
  const analytics = useToolAnalytics();
  return (
    <ActionButton
      disabled={disabled}
      icon="trash-2"
      onClick={() => {
        onClear();
        analytics?.action("clear");
      }}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
