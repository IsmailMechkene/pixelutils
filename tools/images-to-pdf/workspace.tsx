"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

import {
  FilePicker,
  FileResult,
  ProcessingStatus,
  ReorderableFileList,
} from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { CustomSelect } from "@/components/ui/custom-select";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  imageToPdfAccept,
  maxImagesToPdfFileBytes,
  validateImageCollection,
  type PdfImageMargin,
  type PdfImageOrientation,
  type PdfImagePageSize,
} from "./logic";
import { createPdfFromImages } from "./pdf";

const pageSizeOptions = [
  { value: "auto", label: "Auto / fit image", description: "Each page matches its image." },
  { value: "a4", label: "A4", description: "International standard paper." },
  { value: "letter", label: "Letter", description: "US Letter paper." },
] as const;

const orientationOptions = [
  { value: "auto", label: "Auto", description: "Choose orientation per image." },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
] as const;

const marginOptions = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
] as const;

function getImagesToPdfError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The PDF could not be created. Check the selected images and try again.";
}

export default function ImagesToPdfWorkspace({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<PdfImagePageSize>("auto");
  const [orientation, setOrientation] = useState<PdfImageOrientation>("auto");
  const [margin, setMargin] = useState<PdfImageMargin>("small");
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const previewUrls = useRef<string[]>([]);

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function clearResult() {
    setResult(undefined);
  }

  function changeFiles(nextFiles: readonly File[]) {
    const validation = validateImageCollection(nextFiles);
    if (validation) {
      setError(validation);
      setStatus(files.length ? "ready" : "error");
      return;
    }
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));
    previewUrls.current = nextPreviews;
    setPreviews(nextPreviews);
    setFiles([...nextFiles]);
    clearResult();
    setError("");
    setStatus(nextFiles.length ? "ready" : "idle");
  }

  function clearAll() {
    changeFiles([]);
    setPageSize("auto");
    setOrientation("auto");
    setMargin("small");
  }

  function changeOption<T extends PdfImagePageSize | PdfImageOrientation | PdfImageMargin>(
    setValue: (value: T) => void,
    value: T,
  ) {
    setValue(value);
    clearResult();
    setError("");
    if (files.length) setStatus("ready");
  }

  async function createPdf() {
    if (!files.length || status === "processing") return;
    clearResult();
    setError("");
    setStatus("processing");
    try {
      const bytes = await createPdfFromImages(files, {
        pageSize,
        orientation,
        margin,
      });
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      setResult({
        blob,
        filename: "images.pdf",
        mimeType: "application/pdf",
        summary: `${files.length} ${files.length === 1 ? "image" : "images"} added as ${files.length} PDF ${files.length === 1 ? "page" : "pages"}.`,
        before: [
          { label: "Images", value: String(files.length) },
          { label: "Total size", value: formatFileSize(files.reduce((total, file) => total + file.size, 0)) },
        ],
        after: [
          { label: "PDF size", value: formatFileSize(blob.size) },
          { label: "Pages", value: String(files.length) },
        ],
      });
      setStatus("success");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (createError) {
      setError(getImagesToPdfError(createError));
      setStatus("error");
    }
  }

  const isBusy = status === "processing";
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <div>
      <FilePicker
        accept={imageToPdfAccept}
        description="JPG, PNG, or WebP images."
        disabled={isBusy}
        files={files}
        label="Choose images or drop them here"
        maxSizeBytes={maxImagesToPdfFileBytes}
        multiple
        onFilesChange={changeFiles}
        expectedOutput="One PDF containing your selected images."
        showList={false}
      />
      <div className="mt-4">
        <ToolNotice title="Private by design" tone="info">
          Your images stay on your device. The PDF is created locally in your browser.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {files.length ? (
        <section aria-labelledby="images-to-pdf-files-title" className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-ink" id="images-to-pdf-files-title">Images in PDF order</h2>
            <p className="text-xs text-ink-subtle">{files.length} {files.length === 1 ? "image" : "images"} · {formatFileSize(totalSize)}</p>
          </div>
          <p className="mt-1 text-xs leading-5 text-ink-subtle">Drag to reorder with a mouse, or use the move buttons on any device. Each image becomes one PDF page.</p>
          <ReorderableFileList
            disabled={isBusy}
            fileDetails={(file) => `Image · ${formatFileSize(file.size)}`}
            files={files}
            onFilesChange={changeFiles}
            renderPreview={(file, index) => (
              <img alt="" className="size-12 shrink-0 rounded-control border border-line bg-panel object-cover" src={previews[index]} />
            )}
          />

          <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <CustomSelect id="images-to-pdf-page-size" label="Page size" onChange={(value) => changeOption(setPageSize, value)} options={pageSizeOptions} value={pageSize} />
            <CustomSelect id="images-to-pdf-orientation" label="Orientation" onChange={(value) => changeOption(setOrientation, value)} options={orientationOptions} value={orientation} />
            <CustomSelect id="images-to-pdf-margin" label="Margin" onChange={(value) => changeOption(setMargin, value)} options={marginOptions} value={margin} />
          </div>
          {pageSize === "auto" ? <p className="mt-3 text-xs leading-5 text-ink-subtle">Auto pages fit each image exactly. Orientation only applies to A4 and Letter pages.</p> : null}
          <div className="mt-5 border-t border-line pt-4">
            <ToolActions label="Images to PDF actions">
              <ActionButton disabled={isBusy || !files.length} icon="file" onClick={createPdf} tone="primary">Create PDF</ActionButton>
              <ClearButton disabled={isBusy} onClear={clearAll} />
            </ToolActions>
          </div>
        </section>
      ) : null}

      {result ? <FileResult analyticsKind="document" downloadTone="primary" onClear={clearAll} onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })} result={result} /> : null}
    </div>
  );
}
