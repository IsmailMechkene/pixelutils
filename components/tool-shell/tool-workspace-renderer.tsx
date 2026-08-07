import { toolWorkspaceLoaders } from "@/tools/workspace-registry";
import { ToolAnalyticsBoundary } from "@/components/analytics/tool-analytics-boundary";
import { analyticsConfig } from "@/lib/analytics/config";
import type { ToolSlug } from "@/lib/catalog/registry";
import type { CategorySlug } from "@/lib/catalog/types";

// This resolver is a Server Component. The 500-tool loader manifest therefore
// stays out of the browser; only the selected client workspace reference is
// sent in the route payload.
export async function ToolWorkspaceRenderer({
  slug,
  category,
}: {
  slug: ToolSlug;
  category: CategorySlug;
}) {
  const loader = toolWorkspaceLoaders[slug];

  if (!loader) {
    return (
      <p className="text-sm leading-6 text-ink-muted" role="alert">
        This tool workspace is not available. Published tools must register a
        lazy workspace loader.
      </p>
    );
  }

  const { default: Workspace } = await loader();
  if (analyticsConfig.enabled) {
    return (
      <ToolAnalyticsBoundary category={category} toolSlug={slug}>
        <Workspace slug={slug} />
      </ToolAnalyticsBoundary>
    );
  }
  return <Workspace slug={slug} />;
}
