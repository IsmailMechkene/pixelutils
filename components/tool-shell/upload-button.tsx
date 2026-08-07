"use client";

import { useToolAnalytics } from "@/components/analytics/tool-analytics-boundary";
import { ActionButton } from "./action-button";

interface UploadButtonProps {
  onUpload: () => void;
  disabled?: boolean;
  label?: string;
}

export function UploadButton({
  onUpload,
  disabled = false,
  label = "Upload",
}: UploadButtonProps) {
  const analytics = useToolAnalytics();
  return (
    <ActionButton
      disabled={disabled}
      icon="file-up"
      onClick={() => {
        onUpload();
        analytics?.action("upload");
      }}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
