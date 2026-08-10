"use client";

import { DownloadButton } from "@/components/tool-shell/download-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import type { AnalyticsDownloadKind } from "@/lib/analytics/schema";
import type { FileToolInfoRow, FileToolResult } from "@/lib/file-tools/types";

interface FileResultProps {
  result: FileToolResult;
  onClear?: () => void;
  analyticsKind?: AnalyticsDownloadKind;
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
}: FileResultProps) {
  const hasComparison = Boolean(result.before?.length || result.after?.length);

  return (
    <section
      aria-labelledby="file-result-title"
      className="mt-6 border-t border-line pt-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ink" id="file-result-title">
            Result ready
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
            label="Download result"
            mimeType={result.mimeType}
          />
          {onClear ? (
            <ClearButton label="Clear result" onClear={onClear} />
          ) : null}
        </ToolActions>
      </div>
      {hasComparison ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.before?.length ? (
            <InformationList heading="Before" rows={result.before} />
          ) : null}
          {result.after?.length ? (
            <InformationList heading="After" rows={result.after} />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
