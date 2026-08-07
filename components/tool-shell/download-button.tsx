"use client";

import { useToolAnalytics } from "@/components/analytics/tool-analytics-boundary";
import type { AnalyticsDownloadKind } from "@/lib/analytics/schema";

import { ActionButton } from "./action-button";

interface DownloadButtonProps {
  data: string | Blob;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
  label?: string;
  analyticsKind?: AnalyticsDownloadKind;
  onDownloaded?: () => void;
}

export function DownloadButton({
  data,
  filename,
  mimeType = "text/plain;charset=utf-8",
  disabled = false,
  label = "Download",
  analyticsKind = "text",
  onDownloaded,
}: DownloadButtonProps) {
  const analytics = useToolAnalytics();
  function download() {
    const blob =
      data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    analytics?.download(analyticsKind);
    onDownloaded?.();
  }

  const empty = typeof data === "string" && !data;

  return (
    <ActionButton
      disabled={disabled || empty}
      icon="download"
      onClick={download}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
