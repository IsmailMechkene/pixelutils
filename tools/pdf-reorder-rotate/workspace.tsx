"use client";

import { useState } from "react";

import {
  FilePicker,
  FileResult,
  ProcessingStatus,
} from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import {
  loadPdfDocument,
  reorderAndRotatePdfPages,
} from "@/lib/pdf/pdf-lib-client";
import { maxPdfFileBytes, pdfAccept } from "@/lib/pdf/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  createPdfPageEdits,
  getEditedPdfFilename,
  movePdfPageEdit,
  rotatePdfPageEdit,
  type PdfPageEdit,
} from "./logic";

function getPdfErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("encrypted") || message.includes("password")) {
    return "This PDF is password-protected or encrypted. Remove its password before editing pages.";
  }
  return "This PDF could not be read. Check that it is a valid, unprotected PDF.";
}

export default function PdfReorderRotateWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [pages, setPages] = useState<PdfPageEdit[]>([]);
  const [dragIndex, setDragIndex] = useState<number>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");

  function resetResult() {
    setResult(undefined);
    if (file && status === "success") setStatus("ready");
  }

  function clearAll() {
    setFile(undefined);
    setPages([]);
    setDragIndex(undefined);
    setResult(undefined);
    setError("");
    setStatus("idle");
  }

  async function selectFile(files: readonly File[]) {
    const nextFile = files[0];
    if (!nextFile) {
      clearAll();
      return;
    }
    setFile(nextFile);
    setPages([]);
    setResult(undefined);
    setError("");
    setStatus("processing");
    try {
      const document = await loadPdfDocument(nextFile);
      const pageCount = document.getPageCount();
      if (!pageCount) throw new Error("empty");
      setPages(createPdfPageEdits(pageCount));
      setStatus("ready");
    } catch (loadError) {
      setError(getPdfErrorMessage(loadError));
      setStatus("error");
    }
  }

  function changePages(nextPages: PdfPageEdit[]) {
    setPages(nextPages);
    resetResult();
  }

  async function saveEditedPdf() {
    if (!file || !pages.length || status === "processing") return;
    setResult(undefined);
    setError("");
    setStatus("processing");
    try {
      const bytes = await reorderAndRotatePdfPages(file, pages);
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });
      const rotatedPages = pages.filter((page) => page.rotation !== 0).length;
      setResult({
        blob,
        filename: getEditedPdfFilename(file.name),
        mimeType: "application/pdf",
        summary: `${pages.length} pages were kept in your selected order${rotatedPages ? `, with ${rotatedPages} rotated` : ""}.`,
        before: [
          { label: "Pages", value: String(pages.length) },
          { label: "File size", value: formatFileSize(file.size) },
        ],
        after: [
          { label: "Pages", value: String(pages.length) },
          { label: "Rotated pages", value: String(rotatedPages) },
          { label: "File size", value: formatFileSize(blob.size) },
        ],
      });
      setStatus("success");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (saveError) {
      setError(getPdfErrorMessage(saveError));
      setStatus("error");
    }
  }

  return (
    <div>
      <FilePicker
        accept={pdfAccept}
        description="PDF files."
        disabled={status === "processing"}
        expectedOutput="A new PDF with the page order and rotations you choose."
        files={file ? [file] : []}
        label="Choose a PDF or drop it here"
        maxSizeBytes={maxPdfFileBytes}
        onFilesChange={selectFile}
      />
      <div className="mt-4">
        <ToolNotice title="Private by design" tone="info">
          Your PDF stays on your device. Pages are copied directly into a new
          PDF; they are not converted to images.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {file && pages.length ? (
        <section aria-labelledby="pdf-page-editor-title" className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              className="text-base font-bold text-ink"
              id="pdf-page-editor-title"
            >
              Page order and rotation
            </h2>
            <p className="text-xs text-ink-subtle">
              {pages.length} {pages.length === 1 ? "page" : "pages"} ·{" "}
              {formatFileSize(file.size)}
            </p>
          </div>
          <p className="mt-1 text-xs leading-5 text-ink-subtle">
            Drag pages to reorder them, or use the move buttons. Rotate a page
            clockwise in 90° steps.
          </p>
          <ol
            className="mt-4 grid gap-2"
            aria-label="PDF pages in output order"
          >
            {pages.map((page, index) => (
              <li
                className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-panel p-3"
                key={page.sourceIndex}
              >
                <button
                  aria-label={`Drag source page ${page.sourceIndex + 1}, or drop another page here`}
                  className="min-h-11 min-w-28 flex-1 cursor-grab rounded-control border border-line px-3 text-left text-xs font-bold text-ink-subtle disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={status === "processing"}
                  draggable={status !== "processing"}
                  onDragEnd={() => setDragIndex(undefined)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={() => setDragIndex(index)}
                  onDrop={() => {
                    if (dragIndex !== undefined)
                      changePages(movePdfPageEdit(pages, dragIndex, index));
                    setDragIndex(undefined);
                  }}
                  type="button"
                >
                  Drag or drop page
                </button>
                <div className="min-w-24 flex-1">
                  <p className="text-sm font-semibold text-ink">
                    Page {index + 1}{" "}
                    <span className="font-normal text-ink-subtle">
                      (source page {page.sourceIndex + 1})
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    Rotation: {page.rotation}°
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    aria-label={`Move source page ${page.sourceIndex + 1} up`}
                    className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={status === "processing" || index === 0}
                    onClick={() =>
                      changePages(movePdfPageEdit(pages, index, index - 1))
                    }
                    type="button"
                  >
                    Up
                  </button>
                  <button
                    aria-label={`Move source page ${page.sourceIndex + 1} down`}
                    className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={
                      status === "processing" || index === pages.length - 1
                    }
                    onClick={() =>
                      changePages(movePdfPageEdit(pages, index, index + 1))
                    }
                    type="button"
                  >
                    Down
                  </button>
                  <button
                    aria-label={`Rotate source page ${page.sourceIndex + 1} clockwise`}
                    className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={status === "processing"}
                    onClick={() =>
                      changePages(rotatePdfPageEdit(pages, page.sourceIndex))
                    }
                    type="button"
                  >
                    Rotate 90°
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 border-t border-line pt-4">
            <ToolActions label="PDF page editor actions">
              <ActionButton
                disabled={status === "processing"}
                icon="file"
                onClick={saveEditedPdf}
                tone="primary"
              >
                Save edited PDF
              </ActionButton>
              <ClearButton
                disabled={status === "processing"}
                onClear={clearAll}
              />
            </ToolActions>
          </div>
        </section>
      ) : null}
      {result ? (
        <FileResult
          analyticsKind="document"
          downloadTone="primary"
          onClear={clearAll}
          onDownloaded={() =>
            recordToolHistory(slug, "downloaded", { sensitive: false })
          }
          result={result}
        />
      ) : null}
    </div>
  );
}
