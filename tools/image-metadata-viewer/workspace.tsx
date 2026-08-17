"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FilePicker, ProcessingStatus } from "@/components/file-tools";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { formatFileSize } from "@/lib/file-tools/format";
import { createObjectUrlHandle } from "@/lib/file-tools/object-url";
import type { FileToolStatus } from "@/lib/file-tools/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  getSupportedImageMime,
  imageCompressorAccept,
  maxImageCompressorBytes,
  type SupportedImageMime,
} from "../image-compressor/logic";
import { inspectImageMetadata, type MetadataField } from "./logic";

type Inspection = {
  readonly mimeType: SupportedImageMime;
  readonly fields: readonly MetadataField[];
};

export default function ImageMetadataViewerWorkspace({
  slug,
}: {
  slug: string;
}) {
  const [file, setFile] = useState<File>();
  const [sourceUrl, setSourceUrl] = useState<string>();
  const [inspection, setInspection] = useState<Inspection>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const sourceHandle = useRef(createObjectUrlHandle());

  useEffect(() => () => sourceHandle.current.dispose(), []);

  function clearAll() {
    sourceHandle.current.replace();
    setFile(undefined);
    setSourceUrl(undefined);
    setInspection(undefined);
    setError("");
    setStatus("idle");
  }

  async function inspectFile(files: readonly File[]) {
    const nextFile = files[0];
    if (!nextFile) return clearAll();
    const mimeType = getSupportedImageMime(nextFile);
    sourceHandle.current.replace();
    setFile(nextFile);
    setSourceUrl(undefined);
    setInspection(undefined);
    setError("");
    if (!mimeType) {
      setError("Choose a PNG, JPG, JPEG, or WebP image.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    try {
      const data = new Uint8Array(await nextFile.arrayBuffer());
      setInspection({ mimeType, fields: inspectImageMetadata(data, mimeType) });
      setSourceUrl(sourceHandle.current.replace(nextFile));
      setStatus("success");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch {
      setError(
        "The image metadata could not be read. Choose a valid image and try again.",
      );
      setStatus("error");
    }
  }

  const groups: MetadataField["group"][] = ["EXIF", "Location", "Other"];

  return (
    <div>
      <FilePicker
        accept={imageCompressorAccept}
        description="PNG, JPG, JPEG, or WebP images."
        disabled={status === "processing"}
        expectedOutput="A local report of readable camera, location, and embedded metadata."
        files={file ? [file] : []}
        label="Choose an image or drop it here"
        maxSizeBytes={maxImageCompressorBytes}
        onFilesChange={inspectFile}
      />
      <div className="mt-4">
        <ToolNotice title="Private inspection" tone="info">
          Your image is read only in this browser. Metadata values are never
          uploaded, logged, or saved.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {file && inspection && sourceUrl ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby="metadata-viewer-source-title">
            <h2
              className="text-base font-bold text-ink"
              id="metadata-viewer-source-title"
            >
              Source image
            </h2>
            <p className="mt-1 text-xs text-ink-subtle">
              {file.name} ·{" "}
              {inspection.mimeType.replace("image/", "").toUpperCase()} ·{" "}
              {formatFileSize(file.size)}
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
            aria-labelledby="metadata-results-title"
            className="rounded-card border border-line bg-panel-muted p-4"
          >
            <h2
              className="text-base font-bold text-ink"
              id="metadata-results-title"
            >
              Readable metadata
            </h2>
            {inspection.fields.length ? (
              <div className="mt-4 grid gap-4">
                {groups.map((group) => {
                  const fields = inspection.fields.filter(
                    (field) => field.group === group,
                  );
                  return fields.length ? (
                    <section key={group}>
                      <h3 className="mono-label text-ink-subtle">{group}</h3>
                      <dl className="mt-2 grid gap-2">
                        {fields.map((field) => (
                          <div
                            className="rounded-control border border-line bg-panel px-3 py-2"
                            key={`${field.label}-${field.value}`}
                          >
                            <dt className="text-xs text-ink-subtle">
                              {field.label}
                            </dt>
                            <dd className="mt-0.5 break-words text-sm font-semibold text-ink">
                              {field.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                No readable optional metadata fields were found in the supported
                image blocks.
              </p>
            )}
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-sm leading-6 text-ink-muted">
                Want a new export without copied original metadata containers?
              </p>
              <Link
                className="mt-3 inline-flex min-h-11 items-center rounded-control border border-line bg-panel px-3 text-sm font-semibold text-ink hover:bg-panel-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                href="/tools/remove-image-metadata"
              >
                Open Image Metadata Remover
              </Link>
            </div>
            <div className="mt-4">
              <ToolActions label="Metadata viewer actions">
                <ClearButton onClear={clearAll} />
              </ToolActions>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
