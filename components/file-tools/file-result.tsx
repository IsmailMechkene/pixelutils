"use client";

import { DownloadButton } from "@/components/tool-shell/download-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { Icon } from "@/components/ui/icon";
import type { AnalyticsDownloadKind } from "@/lib/analytics/schema";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolInfoRow, FileToolResult } from "@/lib/file-tools/types";

interface FileResultProps {
  result: FileToolResult;
  onClear?: () => void;
  analyticsKind?: AnalyticsDownloadKind;
  downloadTone?: "default" | "primary" | "quiet";
  onDownloaded?: () => void;
}

function formatOutputType(mimeType: string) {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("image/")) {
    return mimeType.slice("image/".length).toUpperCase().replace("JPEG", "JPG");
  }
  if (mimeType.startsWith("video/")) {
    return mimeType.slice("video/".length).toUpperCase();
  }
  return mimeType;
}

function InformationList({
  heading,
  rows,
}: {
  heading: string;
  rows: readonly FileToolInfoRow[];
}) {
  return (
    <section
      aria-label={heading}
      className="min-w-0 rounded-control border border-line bg-canvas p-3.5"
    >
      <h3 className="mono-label text-ink-subtle">{heading}</h3>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-ink-subtle">{row.label}</dt>
            <dd className="mt-0.5 break-words font-semibold text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function FileResult({
  result,
  onClear,
  analyticsKind = "document",
  downloadTone = "primary",
  onDownloaded,
}: FileResultProps) {
  const hasOutputSize = result.after?.some((row) =>
    row.label.toLowerCase().includes("size"),
  );
  const outputRows: readonly FileToolInfoRow[] = [
    { label: "Format", value: formatOutputType(result.mimeType) },
    ...(result.after ?? []),
    ...(hasOutputSize
      ? []
      : [{ label: "File size", value: formatFileSize(result.blob.size) }]),
  ];

  return (
    <section
      aria-labelledby="file-result-title"
      className="mt-6 rounded-card border border-success/30 bg-success-soft p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-success">
            <Icon className="size-5" name="circle-check" />
            Complete
          </p>
          <h2 className="mt-1 text-lg font-bold text-ink" id="file-result-title">
            Your output is ready
          </h2>
          {result.summary ? (
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              {result.summary}
            </p>
          ) : null}
        </div>
        <ToolActions label="Result actions">
          <DownloadButton
            analyticsKind={analyticsKind}
            data={result.blob}
            filename={result.filename}
            label={`Download ${formatOutputType(result.mimeType)}`}
            mimeType={result.mimeType}
            onDownloaded={onDownloaded}
            tone={downloadTone}
          />
          {onClear ? (
            <ClearButton label="Clear result" onClear={onClear} />
          ) : null}
        </ToolActions>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InformationList heading="Output" rows={outputRows} />
        {result.before?.length ? (
          <InformationList heading="Source" rows={result.before} />
        ) : null}
      </div>
    </section>
  );
}
