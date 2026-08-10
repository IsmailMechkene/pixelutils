export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"] as const;
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const maximumFractionDigits = value >= 10 ? 0 : 1;
  return `${new Intl.NumberFormat("en", { maximumFractionDigits }).format(value)} ${units[unitIndex]}`;
}

export function getFileTypeLabel(file: Pick<File, "type" | "name">): string {
  if (file.type) return file.type;

  const extension = file.name.split(".").pop();
  return extension ? `.${extension.toUpperCase()} file` : "Unknown file type";
}
