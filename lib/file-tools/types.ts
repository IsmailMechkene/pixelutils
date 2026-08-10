export type FileToolStatus =
  "idle" | "ready" | "processing" | "success" | "error";

export interface FileToolInfoRow {
  readonly label: string;
  readonly value: string;
}

export interface FileToolResult {
  readonly blob: Blob;
  readonly filename: string;
  readonly mimeType: string;
  readonly summary?: string;
  readonly before?: readonly FileToolInfoRow[];
  readonly after?: readonly FileToolInfoRow[];
}
