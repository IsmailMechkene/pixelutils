"use client";

import { useRef, useState } from "react";

import { FilePicker, FileResult, ProcessingStatus } from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { Icon } from "@/components/ui/icon";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { mergePdfFiles } from "@/lib/pdf/pdf-lib-client";
import { maxPdfFileBytes, pdfAccept } from "@/lib/pdf/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

function moveItem<T>(items: readonly T[], from: number, to: number) {
  if (to < 0 || to >= items.length || from === to) return [...items];
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function getMergeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("encrypted") || message.includes("password")) {
    return "One of these PDFs is password-protected or encrypted. Remove its password before merging.";
  }
  return "One of these PDFs could not be read. Check that every file is a valid, unprotected PDF.";
}

export default function MergePdfWorkspace({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const dragIndex = useRef<number | undefined>(undefined);

  function clearResult() {
    setResult(undefined);
  }

  function changeFiles(nextFiles: readonly File[]) {
    setFiles([...nextFiles]);
    clearResult();
    setError("");
    setStatus(nextFiles.length ? "ready" : "idle");
  }

  function clearAll() {
    setFiles([]);
    clearResult();
    setError("");
    setStatus("idle");
  }

  async function merge() {
    if (files.length < 2 || status === "processing") return;
    clearResult();
    setError("");
    setStatus("processing");
    try {
      const bytes = await mergePdfFiles(files);
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      setResult({
        blob,
        filename: "merged.pdf",
        mimeType: "application/pdf",
        summary: `${files.length} PDFs were merged in the selected order.`,
        before: [
          { label: "Files", value: String(files.length) },
          {
            label: "Total size",
            value: formatFileSize(files.reduce((total, file) => total + file.size, 0)),
          },
        ],
        after: [{ label: "File size", value: formatFileSize(blob.size) }],
      });
      setStatus("success");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (mergeError) {
      setError(getMergeErrorMessage(mergeError));
      setStatus("error");
    }
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <div>
      <FilePicker
        accept={pdfAccept}
        description="Choose two or more PDF files, up to 50 MB each."
        disabled={status === "processing"}
        files={files}
        label="Choose PDFs or drop them here"
        maxSizeBytes={maxPdfFileBytes}
        multiple
        onFilesChange={changeFiles}
        showList={false}
      />
      <div className="mt-4">
        <ToolNotice title="Private by design" tone="info">
          Your PDFs stay on your device. Pages are copied directly into a new PDF and are not converted to images.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {files.length ? (
        <section aria-labelledby="merge-files-title" className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-ink" id="merge-files-title">
              Files to merge
            </h2>
            <p className="text-xs text-ink-subtle">
              {files.length} {files.length === 1 ? "file" : "files"} · {formatFileSize(totalSize)}
            </p>
          </div>
          <p className="mt-1 text-xs leading-5 text-ink-subtle">
            Drag to reorder with a mouse, or use the move buttons on any device. The first file becomes the first section of the merged PDF.
          </p>
          <ol className="mt-3 divide-y divide-line rounded-card border border-line bg-panel-muted">
            {files.map((file, index) => (
              <li
                className="flex min-w-0 items-center gap-3 px-3.5 py-3 sm:px-4"
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-control border border-line bg-panel text-ink-muted" aria-hidden="true">
                  <Icon className="size-4" name="file" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    <span className="mr-2 font-mono text-xs text-ink-subtle">{index + 1}.</span>
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-subtle">PDF · {formatFileSize(file.size)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <ActionButton
                    aria-label={`Drag ${file.name} to a new position`}
                    className="px-2.5"
                    disabled={status === "processing"}
                    draggable={status !== "processing"}
                    onDragEnd={() => {
                      dragIndex.current = undefined;
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => {
                      dragIndex.current = index;
                    }}
                    onDrop={() => {
                      if (dragIndex.current === undefined) return;
                      changeFiles(moveItem(files, dragIndex.current, index));
                      dragIndex.current = undefined;
                    }}
                    tone="quiet"
                  >
                    Drag
                  </ActionButton>
                  <ActionButton
                    aria-label={`Move ${file.name} earlier`}
                    className="px-2.5"
                    disabled={index === 0 || status === "processing"}
                    onClick={() => changeFiles(moveItem(files, index, index - 1))}
                    tone="quiet"
                  >
                    Up
                  </ActionButton>
                  <ActionButton
                    aria-label={`Move ${file.name} later`}
                    className="px-2.5"
                    disabled={index === files.length - 1 || status === "processing"}
                    onClick={() => changeFiles(moveItem(files, index, index + 1))}
                    tone="quiet"
                  >
                    Down
                  </ActionButton>
                  <ActionButton
                    aria-label={`Remove ${file.name}`}
                    className="px-2.5"
                    disabled={status === "processing"}
                    icon="x"
                    onClick={() => changeFiles(files.filter((_, itemIndex) => itemIndex !== index))}
                    tone="quiet"
                  >
                    Remove
                  </ActionButton>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 border-t border-line pt-4">
            <ToolActions label="Merge PDF actions">
              <ActionButton
                disabled={files.length < 2 || status === "processing"}
                icon="file"
                onClick={merge}
                tone="primary"
              >
                Merge PDFs
              </ActionButton>
              <ClearButton disabled={status === "processing" || !files.length} onClear={clearAll} />
            </ToolActions>
          </div>
        </section>
      ) : null}

      {result ? (
        <FileResult
          analyticsKind="document"
          downloadTone="primary"
          onClear={clearAll}
          onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })}
          result={result}
        />
      ) : null}
    </div>
  );
}
