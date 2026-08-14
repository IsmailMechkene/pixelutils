"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

import { FilePicker, ProcessingStatus } from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { DownloadButton } from "@/components/tool-shell/download-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { CustomSelect } from "@/components/ui/custom-select";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolStatus } from "@/lib/file-tools/types";
import { validatePdfPageRange } from "@/lib/pdf/file";
import { maxPdfFileBytes, pdfAccept } from "@/lib/pdf/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  getPdfImageFilename,
  maxPdfToImagesFileBytes,
  previewPageLimit,
  validatePdfRenderPlan,
  type PdfImageOutputFormat,
  type PdfRenderScale,
} from "./logic";
import {
  disposePdfDocument,
  loadPdfForImageRendering,
  renderPdfPageToImage,
  type PdfDocumentHandle,
} from "./renderer";

type PageMode = "all" | "range";

interface RenderedImage {
  readonly pageNumber: number;
  readonly filename: string;
  readonly blob: Blob;
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

const formatOptions = [
  { value: "image/png", label: "PNG", description: "Lossless image output." },
  { value: "image/jpeg", label: "JPEG", description: "Smaller files with quality control." },
] as const;

const scaleOptions = [
  { value: "1", label: "Standard", description: "Good for screens and sharing." },
  { value: "1.5", label: "High", description: "Sharper output at a moderate size." },
  { value: "2", label: "Very high", description: "Largest files; may be limited for large pages." },
] as const;

function getRenderError(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") return undefined;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("password") || message.includes("encrypted")) {
    return "This PDF is password-protected or encrypted. Remove its password before converting pages.";
  }
  if (message.includes("invalid pdf") || message.includes("malformed")) {
    return "This PDF could not be read. Choose a valid, unprotected PDF and try again.";
  }
  return error instanceof Error
    ? error.message
    : "The PDF could not be rendered. Try a smaller or different PDF.";
}

export default function PdfToImagesWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [pageCount, setPageCount] = useState<number>();
  const [pageMode, setPageMode] = useState<PageMode>("all");
  const [rangeStart, setRangeStart] = useState("1");
  const [rangeEnd, setRangeEnd] = useState("");
  const [format, setFormat] = useState<PdfImageOutputFormat>("image/png");
  const [scale, setScale] = useState<PdfRenderScale>("1");
  const [quality, setQuality] = useState(88);
  const [previews, setPreviews] = useState<RenderedImage[]>([]);
  const [outputs, setOutputs] = useState<RenderedImage[]>([]);
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<{ completed: number; total: number }>();
  const documentRef = useRef<PdfDocumentHandle | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const previewUrlsRef = useRef<string[]>([]);
  const outputUrlsRef = useRef<string[]>([]);
  const requestVersion = useRef(0);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      void disposePdfDocument(documentRef.current);
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      outputUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function clearOutputUrls() {
    outputUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    outputUrlsRef.current = [];
  }

  function clearImages() {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
    clearOutputUrls();
    setPreviews([]);
    setOutputs([]);
  }

  async function inspect(fileToInspect: File) {
    const version = ++requestVersion.current;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    await disposePdfDocument(documentRef.current);
    documentRef.current = undefined;
    clearImages();
    setFile(fileToInspect);
    setPageCount(undefined);
    setError("");
    setProgress(undefined);
    setStatus("processing");

    const nextPreviews: RenderedImage[] = [];
    try {
      const document = await loadPdfForImageRendering(fileToInspect);
      if (requestVersion.current !== version) {
        await disposePdfDocument(document);
        return;
      }
      documentRef.current = document;
      setPageCount(document.numPages);
      setRangeEnd(String(document.numPages));

      const thumbnailCount = Math.min(document.numPages, previewPageLimit);
      for (let pageNumber = 1; pageNumber <= thumbnailCount; pageNumber += 1) {
        const rendered = await renderPdfPageToImage(
          document,
          pageNumber,
          0.35,
          "image/png",
          100,
          abortControllerRef.current.signal,
        );
        if (requestVersion.current !== version) {
          nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
          return;
        }
        const url = URL.createObjectURL(rendered.blob);
        nextPreviews.push({
          ...rendered,
          pageNumber,
          filename: getPdfImageFilename(fileToInspect.name, pageNumber, "image/png"),
          url,
        });
      }
      if (requestVersion.current !== version) {
        nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        return;
      }
      previewUrlsRef.current = nextPreviews.map((preview) => preview.url);
      setPreviews(nextPreviews);
      setStatus("ready");
    } catch (inspectError) {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      if (requestVersion.current !== version) return;
      const message = getRenderError(inspectError);
      if (message) {
        setError(message);
        setStatus("error");
      }
    }
  }

  function changeFiles(nextFiles: readonly File[]) {
    const nextFile = nextFiles[0];
    if (!nextFile) {
      clearAll();
      return;
    }
    void inspect(nextFile);
  }

  function clearAll() {
    requestVersion.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = undefined;
    void disposePdfDocument(documentRef.current);
    documentRef.current = undefined;
    clearImages();
    setFile(undefined);
    setPageCount(undefined);
    setRangeStart("1");
    setRangeEnd("");
    setError("");
    setProgress(undefined);
    setStatus("idle");
  }

  function resetResult() {
    clearOutputUrls();
    setOutputs([]);
    setError("");
    setProgress(undefined);
    if (file && pageCount) setStatus("ready");
  }

  function cancelRendering() {
    requestVersion.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = undefined;
    setProgress(undefined);
    setStatus(file && pageCount ? "ready" : "idle");
  }

  async function renderPages() {
    if (!file || !pageCount || !documentRef.current || status === "processing") return;
    let selectedPages: number[];
    if (pageMode === "all") {
      selectedPages = Array.from({ length: pageCount }, (_, index) => index + 1);
    } else {
      const range = { start: Number(rangeStart), end: Number(rangeEnd) };
      const rangeError = validatePdfPageRange(range, pageCount);
      if (rangeError) {
        setError(rangeError);
        setStatus("error");
        return;
      }
      selectedPages = Array.from({ length: range.end - range.start + 1 }, (_, index) => range.start + index);
    }
    const planError = validatePdfRenderPlan(selectedPages, pageCount);
    if (planError) {
      setError(planError);
      setStatus("error");
      return;
    }

    clearOutputUrls();
    setOutputs([]);
    setError("");
    setStatus("processing");
    setProgress({ completed: 0, total: selectedPages.length });
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const version = ++requestVersion.current;
    const nextOutputs: RenderedImage[] = [];
    try {
      for (const [index, pageNumber] of selectedPages.entries()) {
        const rendered = await renderPdfPageToImage(
          documentRef.current,
          pageNumber,
          Number(scale),
          format,
          quality,
          controller.signal,
        );
        if (requestVersion.current !== version) return;
        const url = URL.createObjectURL(rendered.blob);
        nextOutputs.push({
          ...rendered,
          pageNumber,
          filename: getPdfImageFilename(file.name, pageNumber, format),
          url,
        });
        setProgress({ completed: index + 1, total: selectedPages.length });
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      }
      if (requestVersion.current !== version) return;
      outputUrlsRef.current = nextOutputs.map((output) => output.url);
      setOutputs(nextOutputs);
      setStatus("success");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (renderError) {
      nextOutputs.forEach((output) => URL.revokeObjectURL(output.url));
      if (requestVersion.current !== version) return;
      const message = getRenderError(renderError);
      if (message) {
        setError(message);
        setStatus("error");
      }
    } finally {
      if (requestVersion.current === version) setProgress(undefined);
    }
  }

  const isBusy = status === "processing";

  return (
    <div>
      <FilePicker accept={pdfAccept} description="PDF files." disabled={isBusy} expectedOutput="PNG or JPEG files for the pages you choose." files={file ? [file] : []} label="Choose a PDF or drop it here" maxSizeBytes={Math.min(maxPdfFileBytes, maxPdfToImagesFileBytes)} onFilesChange={changeFiles} />
      <div className="mt-4"><ToolNotice title="Private by design" tone="info">Your PDF stays on your device. Pages are rendered locally in your browser and never uploaded.</ToolNotice></div>
      <ProcessingStatus message={error || (isBusy ? "Rendering pages locally..." : undefined)} status={status} />

      {progress ? <div aria-live="polite" className="mt-4"><div className="flex justify-between text-xs text-ink-subtle"><span>Rendering page {progress.completed + 1} of {progress.total}</span><span>{Math.round((progress.completed / progress.total) * 100)}%</span></div><progress aria-label="PDF rendering progress" className="mt-2 h-2 w-full accent-accent" max={progress.total} value={progress.completed} /></div> : null}

      {file && pageCount ? (
        <section aria-labelledby="pdf-image-options-title" className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-base font-bold text-ink" id="pdf-image-options-title">Convert PDF pages</h2><p className="text-xs text-ink-subtle">{pageCount} {pageCount === 1 ? "page" : "pages"}</p></div>
          <fieldset className="mt-3 flex flex-wrap gap-3"><legend className="sr-only">Pages to render</legend><label className="flex min-h-11 items-center gap-2 rounded-control border border-line bg-panel px-3 text-sm font-semibold text-ink"><input checked={pageMode === "all"} disabled={isBusy} name="page-mode" onChange={() => { setPageMode("all"); resetResult(); }} type="radio" />All pages</label><label className="flex min-h-11 items-center gap-2 rounded-control border border-line bg-panel px-3 text-sm font-semibold text-ink"><input checked={pageMode === "range"} disabled={isBusy} name="page-mode" onChange={() => { setPageMode("range"); resetResult(); }} type="radio" />Page range</label></fieldset>
          {pageMode === "range" ? <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold text-ink">First page<input className="min-h-11 rounded-control border border-line bg-panel px-3 text-ink" disabled={isBusy} inputMode="numeric" min="1" onChange={(event) => { setRangeStart(event.target.value); resetResult(); }} type="number" value={rangeStart} /></label><label className="grid gap-1.5 text-sm font-semibold text-ink">Last page<input className="min-h-11 rounded-control border border-line bg-panel px-3 text-ink" disabled={isBusy} inputMode="numeric" max={pageCount} min="1" onChange={(event) => { setRangeEnd(event.target.value); resetResult(); }} type="number" value={rangeEnd} /></label></div> : null}
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><CustomSelect id="pdf-image-format" label="Image format" onChange={(value) => { setFormat(value); resetResult(); }} options={formatOptions} value={format} /><CustomSelect id="pdf-image-resolution" label="Resolution" onChange={(value) => { setScale(value); resetResult(); }} options={scaleOptions} value={scale} /></div>
          {format === "image/jpeg" ? <label className="mt-4 grid gap-2 text-sm font-semibold text-ink">JPEG quality <span className="text-ink-subtle">{quality}</span><input aria-label="JPEG quality" className="accent-accent" disabled={isBusy} max="95" min="60" onChange={(event) => { setQuality(Number(event.target.value)); resetResult(); }} type="range" value={quality} /></label> : null}
          <p className="mt-4 text-xs leading-5 text-ink-subtle">For reliable browser processing, convert up to 50 pages at once. Very large pages may require a lower resolution.</p>
          <div className="mt-5 border-t border-line pt-4"><ToolActions label="PDF to image actions">{isBusy ? <ActionButton onClick={cancelRendering} tone="quiet">Cancel</ActionButton> : <ActionButton icon="file" onClick={renderPages} tone="primary">Convert pages</ActionButton>}<ClearButton disabled={isBusy} onClear={clearAll} /></ToolActions></div>
        </section>
      ) : null}

      {previews.length ? <section aria-labelledby="pdf-previews-title" className="mt-6 border-t border-line pt-5"><h2 className="text-base font-bold text-ink" id="pdf-previews-title">Page previews</h2><p className="mt-1 text-xs leading-5 text-ink-subtle">Only the first {previews.length} {previews.length === 1 ? "page is" : "pages are"} previewed to limit memory use.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{previews.map((preview) => <figure className="rounded-card border border-line bg-panel-muted p-2" key={preview.pageNumber}><img alt={`Preview of PDF page ${preview.pageNumber}`} className="h-44 w-full rounded-control bg-panel object-contain" src={preview.url} /><figcaption className="mt-2 text-xs text-ink-subtle">Page {preview.pageNumber}</figcaption></figure>)}</div></section> : null}

      {outputs.length ? <section aria-labelledby="pdf-image-results-title" className="mt-6 rounded-card border border-success/30 bg-success-soft p-4 sm:p-5"><p className="text-sm font-bold text-success">Complete</p><h2 className="mt-1 text-lg font-bold text-ink" id="pdf-image-results-title">Images ready to download</h2><p className="mt-1 text-sm leading-6 text-ink-muted">Download each rendered image separately. No pages were uploaded.</p><ol className="mt-4 divide-y divide-line rounded-card border border-line bg-panel">{outputs.map((output) => <li className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3 sm:px-4" key={output.filename}><div className="flex min-w-0 items-center gap-3"><img alt="" className="size-12 rounded-control border border-line bg-panel object-cover" src={output.url} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{output.filename}</p><p className="mt-0.5 text-xs text-ink-subtle">Page {output.pageNumber} · {output.width} × {output.height} px · {formatFileSize(output.blob.size)}</p></div></div><DownloadButton analyticsKind="document" data={output.blob} filename={output.filename} label="Download" mimeType={format} onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })} tone="primary" /></li>)}</ol></section> : null}
    </div>
  );
}
