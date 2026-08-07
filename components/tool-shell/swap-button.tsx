"use client";

import { useToolAnalytics } from "@/components/analytics/tool-analytics-boundary";
import { ActionButton } from "./action-button";

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
  label?: string;
}

export function SwapButton({
  onSwap,
  disabled = false,
  label = "Swap",
}: SwapButtonProps) {
  const analytics = useToolAnalytics();
  return (
    <ActionButton
      disabled={disabled}
      icon="arrow-left-right"
      onClick={() => {
        onSwap();
        analytics?.action("swap");
      }}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
