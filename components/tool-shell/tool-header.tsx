import { Icon } from "@/components/ui/icon";
import type { ToolDefinition } from "@/lib/catalog/types";

interface ToolHeaderProps {
  tool: ToolDefinition;
}

export function ToolHeader({ tool }: ToolHeaderProps) {
  return (
    <header className="max-w-3xl">
      <div className="flex items-start gap-4">
        <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-card bg-accent-soft text-accent">
          <Icon className="size-5" name={tool.icon} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Free online tool
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink-muted sm:text-lg">
            {tool.longDescription}
          </p>
        </div>
      </div>
    </header>
  );
}
