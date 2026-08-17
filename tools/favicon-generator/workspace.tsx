"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

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
import { createObjectUrlHandle } from "@/lib/file-tools/object-url";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  getSupportedImageMime,
  imageCompressorAccept,
  maxImageCompressorBytes,
} from "../image-compressor/logic";
import {
  createInstallSnippet,
  createStoredZip,
  createWebManifest,
  type BinaryFile,
} from "./logic";

type FaviconAsset = {
  readonly name: string;
  readonly size: number;
  readonly blob: Blob;
};

type WorkerMessage =
  | {
      type: "favicon-result";
      id: number;
      assets: readonly FaviconAsset[];
      ico: Blob;
    }
  | { type: "error"; id: number; message: string };

export default function FaviconGeneratorWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [siteName, setSiteName] = useState("Website");
  const [sourceUrl, setSourceUrl] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const sourceHandle = useRef(createObjectUrlHandle());
  const previewHandle = useRef(createObjectUrlHandle());
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestId = useRef(0);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      sourceHandle.current.dispose();
      previewHandle.current.dispose();
    },
    [],
  );

  function clearResult() {
    previewHandle.current.replace();
    setPreviewUrl(undefined);
    setResult(undefined);
  }

  function clearAll() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    sourceHandle.current.replace();
    clearResult();
    setFile(undefined);
    setSourceUrl(undefined);
    setError("");
    setStatus("idle");
  }

  function selectFile(files: readonly File[]) {
    const nextFile = files[0];
    if (!nextFile) {
      clearAll();
      return;
    }
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    clearResult();
    setFile(nextFile);
    setSourceUrl(undefined);
    setError("");
    if (!getSupportedImageMime(nextFile)) {
      setError("Choose a PNG, JPG, JPEG, or WebP image.");
      setStatus("error");
      return;
    }
    setSourceUrl(sourceHandle.current.replace(nextFile));
    setStatus("ready");
  }

  function createPackage() {
    if (!file || status === "processing") return;
    clearResult();
    setError("");
    setStatus("processing");
    requestId.current += 1;
    const id = requestId.current;
    try {
      const worker = new Worker(
        new URL(
          "../image-converter/image-converter.worker.ts",
          import.meta.url,
        ),
      );
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        void (async () => {
          const message = event.data;
          if (message.id !== id || workerRef.current !== worker) return;
          worker.terminate();
          workerRef.current = undefined;
          if (message.type === "error") {
            setError(message.message);
            setStatus("error");
            return;
          }
          try {
            const binaries: BinaryFile[] = [
              {
                name: "favicon.ico",
                data: new Uint8Array(await message.ico.arrayBuffer()),
              },
              ...(await Promise.all(
                message.assets.map(async (asset) => ({
                  name: asset.name,
                  data: new Uint8Array(await asset.blob.arrayBuffer()),
                })),
              )),
              {
                name: "site.webmanifest",
                data: new TextEncoder().encode(createWebManifest(siteName)),
              },
              {
                name: "favicon-install-snippet.html",
                data: new TextEncoder().encode(createInstallSnippet()),
              },
            ];
            const packageBlob = new Blob([createStoredZip(binaries)], {
              type: "application/zip",
            });
            const preview = message.assets.find((asset) => asset.size === 512);
            if (preview)
              setPreviewUrl(previewHandle.current.replace(preview.blob));
            setResult({
              blob: packageBlob,
              filename: "favicon-package.zip",
              mimeType: "application/zip",
              summary:
                "Your browser-ready favicon package includes an ICO file, standard PNG icons, a web manifest, and installation markup.",
              before: [
                { label: "Source file", value: file.name },
                { label: "File size", value: formatFileSize(file.size) },
              ],
              after: [
                { label: "Included files", value: `${binaries.length}` },
                { label: "File size", value: formatFileSize(packageBlob.size) },
              ],
            });
            setStatus("success");
            recordToolHistory(slug, "processed", { sensitive: false });
          } catch {
            setError(
              "The favicon package could not be assembled locally. Try a smaller image or try again.",
            );
            setStatus("error");
          }
        })();
      };
      worker.onerror = () => {
        if (workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        setError(
          "The favicon generator stopped unexpectedly. Please try again.",
        );
        setStatus("error");
      };
      worker.postMessage({ type: "favicon", id, file });
    } catch {
      setError(
        "This browser cannot create favicon files locally. Try a current browser.",
      );
      setStatus("error");
    }
  }

  return (
    <div>
      <FilePicker
        accept={imageCompressorAccept}
        description="PNG, JPG, JPEG, or WebP images. Square images work best."
        disabled={status === "processing"}
        expectedOutput="A ZIP package with favicon.ico, PNG icons, site.webmanifest, and install markup."
        files={file ? [file] : []}
        label="Choose one image or drop it here"
        maxSizeBytes={maxImageCompressorBytes}
        onFilesChange={selectFile}
      />
      <div className="mt-4">
        <ToolNotice title="Local processing" tone="info">
          Your image stays on your device. The generator fits it inside each
          square icon and creates the favicon package in your browser.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {file && sourceUrl ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="favicon-source-title">
            <h2
              className="text-base font-bold text-ink"
              id="favicon-source-title"
            >
              Source image
            </h2>
            <p className="mt-1 text-xs text-ink-subtle">
              {file.name} · {formatFileSize(file.size)}
            </p>
            <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
              <img
                alt={`Source preview of ${file.name}`}
                className="max-h-96 max-w-full object-contain"
                src={sourceUrl}
              />
            </div>
          </section>
          <section
            aria-labelledby="favicon-package-title"
            className="rounded-card border border-line bg-panel-muted p-4"
          >
            <h2
              className="text-base font-bold text-ink"
              id="favicon-package-title"
            >
              Package contents
            </h2>
            <label
              className="mt-4 grid gap-2 text-sm font-semibold text-ink"
              htmlFor="favicon-site-name"
            >
              Site name for web manifest
              <input
                className="min-h-11 rounded-control border border-line bg-panel px-3 text-ink"
                id="favicon-site-name"
                maxLength={48}
                onChange={(event) => setSiteName(event.target.value)}
                value={siteName}
              />
            </label>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink-muted">
              <li>favicon.ico with 16, 32, and 48 px icons</li>
              <li>PNG icons from 16 px to 512 px</li>
              <li>site.webmanifest and install snippet</li>
            </ul>
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Favicon generator actions">
                {status === "processing" ? (
                  <ActionButton
                    icon="x"
                    onClick={() => {
                      requestId.current += 1;
                      workerRef.current?.terminate();
                      workerRef.current = undefined;
                      setStatus("ready");
                    }}
                    tone="quiet"
                  >
                    Cancel
                  </ActionButton>
                ) : (
                  <ActionButton
                    icon="refresh-cw"
                    onClick={createPackage}
                    tone="primary"
                  >
                    Create package
                  </ActionButton>
                )}
                <ClearButton disabled={!file} onClear={clearAll} />
              </ToolActions>
            </div>
          </section>
        </div>
      ) : null}

      {previewUrl ? (
        <section aria-labelledby="favicon-preview-title" className="mt-6">
          <h2
            className="text-base font-bold text-ink"
            id="favicon-preview-title"
          >
            512 px app icon
          </h2>
          <div className="mt-3 flex min-h-40 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3">
            <img
              alt="Generated 512 pixel favicon preview"
              className="size-40 object-contain"
              src={previewUrl}
            />
          </div>
        </section>
      ) : null}
      {result ? (
        <FileResult
          analyticsKind="image"
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
