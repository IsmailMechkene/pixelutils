"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";

import { FilePicker } from "./file-picker";
import { FilePrivacyNotice } from "./privacy-notice";
import { FileResult } from "./file-result";
import { ProcessingStatus } from "./processing-status";

/** Internal-only composition example. It is intentionally not registered as a route. */
export function FileToolsDemo() {
  const [files, setFiles] = useState<readonly File[]>([]);
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [result, setResult] = useState<FileToolResult>();

  function clear() {
    setFiles([]);
    setStatus("idle");
    setResult(undefined);
  }

  function prepareDemoResult() {
    const [file] = files;
    if (!file) return;

    setStatus("processing");
    const output = new Blob(["PixelUtils file-tool architecture demo\n"], {
      type: "text/plain;charset=utf-8",
    });
    setResult({
      blob: output,
      filename: "pixelutils-file-tools-demo.txt",
      mimeType: "text/plain;charset=utf-8",
      summary:
        "A local test result was prepared without reading or uploading the selected file.",
      before: [
        { label: "Selected file", value: file.name },
        { label: "Size", value: formatFileSize(file.size) },
      ],
      after: [{ label: "Demo result", value: formatFileSize(output.size) }],
    });
    setStatus("success");
  }

  return (
    <div>
      <FilePicker
        accept="image/*,.pdf"
        description="Select an image or PDF to exercise the reusable picker. The file stays local."
        files={files}
        label="Choose demo files or drop them here"
        maxSizeBytes={25 * 1024 * 1024}
        multiple
        onFilesChange={(nextFiles) => {
          setFiles(nextFiles);
          setStatus(nextFiles.length ? "ready" : "idle");
          setResult(undefined);
        }}
      />
      <FilePrivacyNotice />
      <ProcessingStatus status={status} />
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions label="Demo actions">
          <ActionButton
            disabled={files.length === 0 || status === "processing"}
            icon="check"
            onClick={prepareDemoResult}
            tone="primary"
          >
            Prepare local demo result
          </ActionButton>
          <ClearButton
            disabled={files.length === 0 && !result}
            onClear={clear}
          />
        </ToolActions>
      </div>
      {result ? <FileResult onClear={clear} result={result} /> : null}
    </div>
  );
}
