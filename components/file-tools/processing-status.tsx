import { Icon } from "@/components/ui/icon";
import type { FileToolStatus } from "@/lib/file-tools/types";

interface ProcessingStatusProps {
  status: FileToolStatus;
  message?: string;
}

const statusCopy: Record<FileToolStatus, string> = {
  idle: "Choose a file to begin.",
  ready: "Your files are ready to process locally.",
  processing: "Processing locally in your browser.",
  success: "Processing complete.",
  error: "Processing could not be completed.",
};

export function ProcessingStatus({ status, message }: ProcessingStatusProps) {
  if (status === "idle") return null;

  const isError = status === "error";
  const isComplete = status === "success";
  const icon = isError
    ? "triangle-alert"
    : isComplete
      ? "circle-check"
      : "info";

  return (
    <p
      aria-live={isError ? "assertive" : "polite"}
      className={`mt-4 flex items-start gap-2 rounded-control border px-3.5 py-3 text-sm leading-6 ${
        isError
          ? "border-danger-line bg-danger-soft text-danger"
          : isComplete
            ? "border-success/30 bg-success-soft text-success"
            : "border-line bg-panel-muted text-ink-muted"
      }`}
      role={isError ? "alert" : "status"}
    >
      <Icon className="mt-1 size-4 shrink-0" name={icon} />
      <span>{message ?? statusCopy[status]}</span>
    </p>
  );
}
