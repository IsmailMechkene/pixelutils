"use client";

import { ActionButton } from "@/components/tool-shell/action-button";
import { Icon } from "@/components/ui/icon";
import { formatFileSize, getFileTypeLabel } from "@/lib/file-tools/format";

interface FileListProps {
  files: readonly File[];
  onRemove?: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-4 divide-y divide-line rounded-card border border-line bg-panel-muted">
      {files.map((file, index) => (
        <li
          className="flex min-w-0 items-center gap-3 px-3.5 py-3 sm:px-4"
          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-control border border-line bg-panel text-ink-muted">
            <Icon className="size-4" name="file" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-ink-subtle">
              {getFileTypeLabel(file)} · {formatFileSize(file.size)}
            </p>
          </div>
          {onRemove ? (
            <ActionButton
              aria-label={`Remove ${file.name}`}
              className="shrink-0 px-3"
              icon="x"
              onClick={() => onRemove(index)}
              tone="quiet"
            >
              Remove
            </ActionButton>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
