import { Icon } from "@/components/ui/icon";
import type { ToolDefinition } from "@/lib/catalog/types";

interface PrivacyBadgeProps {
  tool: Pick<ToolDefinition, "browserProcessing" | "privacyNote">;
}

export function PrivacyBadge({ tool }: PrivacyBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        tool.browserProcessing
          ? "bg-success-soft text-success"
          : "bg-panel-muted text-ink-muted"
      }`}
    >
      <Icon className="size-4" name="shield" />
      {tool.privacyNote}
    </div>
  );
}
