import { toolWorkspaceLoaders } from "@/tools/workspace-registry";
import type { ToolSlug } from "@/lib/catalog/registry";

// This resolver is a Server Component. The 500-tool loader manifest therefore
// stays out of the browser; only the selected client workspace reference is
// sent in the route payload.
export async function ToolWorkspaceRenderer({ slug }: { slug: ToolSlug }) {
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
  return <Workspace slug={slug} />;
}
