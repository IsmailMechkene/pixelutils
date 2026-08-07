import type { ToolDefinition } from "@/lib/catalog/types";

import { BrowserProcessingBadge } from "./browser-processing-badge";

interface PrivacyBadgeProps {
  tool: Pick<ToolDefinition, "browserProcessing" | "privacyNote">;
}

export function PrivacyBadge({ tool }: PrivacyBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <BrowserProcessingBadge enabled={tool.browserProcessing} />
      <p className="text-sm leading-6 text-ink-muted">{tool.privacyNote}</p>
    </div>
  );
}
