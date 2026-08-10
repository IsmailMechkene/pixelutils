"use client";

import { useRef, useState } from "react";

import { FilePicker, ProcessingStatus } from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { DownloadButton } from "@/components/tool-shell/download-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolStatus } from "@/lib/file-tools/types";
import {
  getPdfOutputFilename,
  parsePdfPageSelection,
  validatePdfPageRange,
} from "@/lib/pdf/file";
import {
  extractPdfPages,
  loadPdfDocument,
  splitPdfIntoPages,
} from "@/lib/pdf/pdf-lib-client";
import { maxPdfFileBytes, pdfAccept } from "@/lib/pdf/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

type SplitMode = "range" | "specific" | "individual";

interface SplitOutput {
  readonly blob: Blob;
  readonly filename: string;
  readonly pages: string;
}

function getPdfErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("encrypted") || message.includes("password")) {
    return "This PDF is password-protected or encrypted. Remove its password before splitting.";
  }
  return "This PDF could not be read. Choose a valid, unprotected PDF and try again.";
}

function createPdfBlob(bytes: Uint8Array) {
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

export default function SplitPdfWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [pageCount, setPageCount] = useState<number>();
  const [mode, setMode] = useState<SplitMode>("range");
  const [rangeStart, setRangeStart] = useState("1");
  const [rangeEnd, setRangeEnd] = useState("");
  const [specificPages, setSpecificPages] = useState("");
  const [outputs, setOutputs] = useState<SplitOutput[]>([]);
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const selectionVersion = useRef(0);

  function resetResults() {
    setOutputs([]);
    setError("");
  }

  async function changeFiles(nextFiles: readonly File[]) {
    const nextFile = nextFiles[0];
    const version = ++selectionVersion.current;
    setFile(nextFile);
    setPageCount(undefined);
    resetResults();

    if (!nextFile) {
      setStatus("idle");
      return;
    }

    setStatus("processing");
    try {
      const document = await loadPdfDocument(nextFile);
      if (selectionVersion.current !== version) return;
      const nextPageCount = document.getPageCount();
      setPageCount(nextPageCount);
      setRangeEnd(String(nextPageCount));
      setStatus("ready");
    } catch (fileError) {
      if (selectionVersion.current !== version) return;
      setError(getPdfErrorMessage(fileError));
      setStatus("error");
    }
  }

  function changeMode(nextMode: SplitMode) {
    setMode(nextMode);
    resetResults();
    if (file && pageCount) setStatus("ready");
  }

  function clearAll() {
    selectionVersion.current += 1;
    setFile(undefined);
    setPageCount(undefined);
    setRangeStart("1");
    setRangeEnd("");
    setSpecificPages("");
    resetResults();
    setStatus("idle");
  }

  async function split() {
    if (!file || !pageCount || status === "processing") return;
    resetResults();

    let pageNumbers: readonly number[] = [];
    if (mode === "range") {
      const range = { start: Number(rangeStart), end: Number(rangeEnd) };
      const rangeError = validatePdfPageRange(range, pageCount);
      if (rangeError) {
        setError(rangeError);
        setStatus("error");
        return;
      }
      pageNumbers = Array.from(
        { length: range.end - range.start + 1 },
        (_, index) => range.start + index,
      );
    } else if (mode === "specific") {
      const selection = parsePdfPageSelection(specificPages, pageCount);
      if ("error" in selection) {
        setError(selection.error);
        setStatus("error");
        return;
      }
      pageNumbers = selection.pageNumbers;
    }

    setStatus("processing");
    try {
      const nextOutputs =
        mode === "individual"
          ? (await splitPdfIntoPages(file)).map((bytes, index) => ({
              blob: createPdfBlob(bytes),
              filename: getPdfOutputFilename(file.name, `page-${index + 1}`),
              pages: `Page ${index + 1}`,
            }))
          : [
              {
                blob: createPdfBlob(await extractPdfPages(file, pageNumbers)),
                filename: getPdfOutputFilename(
                  file.name,
                  mode === "range" ? `pages-${rangeStart}-${rangeEnd}` : "selected-pages",
                ),
                pages:
                  mode === "range"
                    ? `Pages ${rangeStart}-${rangeEnd}`
                    : `Pages ${specificPages}`,
              },
            ];
      setOutputs(nextOutputs);
      setStatus("success");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (splitError) {
      setError(getPdfErrorMessage(splitError));
      setStatus("error");
    }
  }

  const isBusy = status === "processing";

  return (
    <div>
      <FilePicker
        accept={pdfAccept}
        description="Choose one PDF file, up to 50 MB."
        disabled={isBusy}
        files={file ? [file] : []}
        label="Choose a PDF or drop it here"
        maxSizeBytes={maxPdfFileBytes}
        onFilesChange={changeFiles}
      />
      <div className="mt-4">
        <ToolNotice title="Private by design" tone="info">
          Your PDF stays on your device. Pages are copied into new PDFs and are not converted to images.
        </ToolNotice>
      </div>
      <ProcessingStatus
        message={error || (isBusy && file ? "Reading or preparing your PDF locally..." : undefined)}
        status={status}
      />

      {file && pageCount ? (
        <section aria-labelledby="split-options-title" className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-ink" id="split-options-title">
              Split options
            </h2>
            <p className="text-xs text-ink-subtle">{pageCount} {pageCount === 1 ? "page" : "pages"}</p>
          </div>
          <fieldset className="mt-3 grid gap-2 sm:grid-cols-3">
            <legend className="sr-only">How to split this PDF</legend>
            {[
              ["range", "Extract a range", "Create one PDF from consecutive pages."],
              ["specific", "Extract specific pages", "Create one PDF from a page list."],
              ["individual", "Split every page", "Create one PDF for each page."],
            ].map(([value, label, description]) => (
              <label
                className="flex min-h-24 cursor-pointer flex-col rounded-card border border-line bg-panel p-3.5 text-sm transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
                key={value}
              >
                <span className="flex items-center gap-2 font-semibold text-ink">
                  <input
                    checked={mode === value}
                    className="size-4 accent-accent"
                    disabled={isBusy}
                    name="split-mode"
                    onChange={() => changeMode(value as SplitMode)}
                    type="radio"
                    value={value}
                  />
                  {label}
                </span>
                <span className="mt-1.5 text-xs leading-5 text-ink-subtle">{description}</span>
              </label>
            ))}
          </fieldset>

          {mode === "range" ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                First page
                <input className="min-h-11 rounded-control border border-line bg-panel px-3 text-ink" disabled={isBusy} inputMode="numeric" min="1" onChange={(event) => setRangeStart(event.target.value)} type="number" value={rangeStart} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Last page
                <input className="min-h-11 rounded-control border border-line bg-panel px-3 text-ink" disabled={isBusy} inputMode="numeric" max={pageCount} min="1" onChange={(event) => setRangeEnd(event.target.value)} type="number" value={rangeEnd} />
              </label>
            </div>
          ) : null}

          {mode === "specific" ? (
            <label className="mt-4 grid gap-1.5 text-sm font-semibold text-ink">
              Pages to extract
              <input aria-describedby="specific-pages-help" className="min-h-11 rounded-control border border-line bg-panel px-3 text-ink" disabled={isBusy} onChange={(event) => setSpecificPages(event.target.value)} placeholder="1-3,6,8-10" value={specificPages} />
              <span className="text-xs font-normal leading-5 text-ink-subtle" id="specific-pages-help">Examples: 1-3, 1,3,5, or 1-3,6,8-10. Pages must be between 1 and {pageCount}.</span>
            </label>
          ) : null}

          <div className="mt-5 border-t border-line pt-4">
            <ToolActions label="Split PDF actions">
              <ActionButton disabled={isBusy} icon="file" onClick={split} tone="primary">
                {mode === "individual" ? "Split PDF" : "Extract pages"}
              </ActionButton>
              <ClearButton disabled={isBusy} onClear={clearAll} />
            </ToolActions>
          </div>
        </section>
      ) : null}

      {outputs.length ? (
        <section aria-labelledby="split-results-title" className="mt-6 border-t border-line pt-5">
          <h2 className="text-base font-bold text-ink" id="split-results-title">{outputs.length === 1 ? "Result ready" : `${outputs.length} PDFs ready`}</h2>
          <p className="mt-1 text-sm leading-6 text-ink-muted">Download each generated PDF separately. No files were uploaded or rasterized.</p>
          <ol className="mt-4 divide-y divide-line rounded-card border border-line bg-panel-muted">
            {outputs.map((output) => (
              <li className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3 sm:px-4" key={output.filename}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{output.filename}</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">{output.pages} · {formatFileSize(output.blob.size)}</p>
                </div>
                <DownloadButton analyticsKind="document" data={output.blob} filename={output.filename} label="Download" mimeType="application/pdf" onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })} tone="primary" />
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
