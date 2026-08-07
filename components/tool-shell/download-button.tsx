"use client";

import { ActionButton } from "./action-button";

interface DownloadButtonProps {
  data: string | Blob;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
  label?: string;
  onDownloaded?: () => void;
}

export function DownloadButton({
  data,
  filename,
  mimeType = "text/plain;charset=utf-8",
  disabled = false,
  label = "Download",
  onDownloaded,
}: DownloadButtonProps) {
  function download() {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.click();
    URL.revokeObjectURL(url);
    onDownloaded?.();
  }

  const empty = typeof data === "string" && !data;

  return (
    <ActionButton disabled={disabled || empty} icon="download" onClick={download}>
      {label}
    </ActionButton>
  );
}
