import { Icon } from "@/components/ui/icon";

export function BrowserProcessingBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        enabled
          ? "bg-success-soft text-success"
          : "bg-panel-muted text-ink-muted"
      }`}
    >
      <Icon className="size-4" name={enabled ? "shield-check" : "info"} />
      {enabled ? "Runs in your browser" : "Processing details below"}
    </span>
  );
}
