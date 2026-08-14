"use client";

import { FileDropzone } from "@/components/tool-shell/file-dropzone";
import { formatFileSize } from "@/lib/file-tools/format";

import { FileList } from "./file-list";

interface FilePickerProps {
  files: readonly File[];
  onFilesChange: (files: readonly File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  expectedOutput?: string;
  showList?: boolean;
}

export function FilePicker({
  files,
  onFilesChange,
  accept,
  multiple = false,
  maxSizeBytes,
  disabled = false,
  label,
  description,
  expectedOutput,
  showList = true,
}: FilePickerProps) {
  function addFiles(incomingFiles: readonly File[]) {
    onFilesChange(
      multiple ? [...files, ...incomingFiles] : incomingFiles.slice(0, 1),
    );
  }

  return (
    <div>
      <FileDropzone
        accept={accept}
        description={description}
        disabled={disabled}
        label={label}
        maxSizeBytes={maxSizeBytes}
        multiple={multiple}
        onFiles={addFiles}
      />
      {expectedOutput ? (
        <aside
          aria-label="Before you upload"
          className="mt-3 rounded-control border border-line bg-panel-muted px-4 py-3"
        >
          <p className="mono-label text-ink-subtle">Before you upload</p>
          <ul className="mt-2 grid gap-1 text-xs leading-5 text-ink-muted sm:grid-cols-2">
            {description ? <li><strong className="text-ink">Accepted:</strong> {description}</li> : null}
            {maxSizeBytes ? <li><strong className="text-ink">Limit:</strong> {formatFileSize(maxSizeBytes)} per file</li> : null}
            <li><strong className="text-ink">Privacy:</strong> Your files stay in this browser.</li>
            <li><strong className="text-ink">Result:</strong> {expectedOutput}</li>
          </ul>
        </aside>
      ) : null}
      {showList ? (
        <FileList
          files={files}
          onRemove={
            disabled
              ? undefined
              : (index) =>
                  onFilesChange(
                    files.filter((_, itemIndex) => itemIndex !== index),
                  )
          }
        />
      ) : null}
    </div>
  );
}
