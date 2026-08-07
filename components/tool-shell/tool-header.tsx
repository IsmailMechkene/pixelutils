import { ToolIcon } from "@/components/ui/icon";
import type { ToolDefinition } from "@/lib/catalog/types";
import { FavoriteButton } from "@/components/catalog/favorite-button";

interface ToolHeaderProps {
  tool: ToolDefinition;
}

export function ToolHeader({ tool }: ToolHeaderProps) {
  return (
    <header className="max-w-3xl">
      <div className="flex items-start gap-4">
        <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-card bg-accent-soft text-accent">
          <ToolIcon className="size-8" name={tool.icon} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="section-eyebrow">Free online tool</p>
            <FavoriteButton slug={tool.slug} />
          </div>
          <h1 className="page-title mt-2">{tool.name}</h1>
          <p className="mt-3 text-base leading-7 text-ink-muted sm:text-lg">
            {tool.longDescription}
          </p>
        </div>
      </div>
    </header>
  );
}
