import { ToolCard } from "@/components/catalog/tool-card";
import type { ToolDefinition } from "@/lib/catalog/types";

interface RelatedToolsProps {
  tools: readonly ToolDefinition[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-title">
      <h2 className="content-title" id="related-tools-title">
        Related tools
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Continue with another tool that fits the same workflow.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div data-related-tool-slug={tool.slug} key={tool.slug}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  );
}
