"use client";

import { useToolAnalytics } from "@/components/analytics/tool-analytics-boundary";
import { ActionButton } from "./action-button";

interface SampleButtonProps {
  onSample: () => void;
  disabled?: boolean;
  label?: string;
}

export function SampleButton({
  onSample,
  disabled = false,
  label = "Use sample",
}: SampleButtonProps) {
  const analytics = useToolAnalytics();
  return (
    <ActionButton
      disabled={disabled}
      icon="sparkles"
      onClick={() => {
        onSample();
        analytics?.action("sample");
      }}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
