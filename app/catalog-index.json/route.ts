import { publishedCategories, publishedTools } from "@/lib/catalog/registry";
import { createToolSearchItems } from "@/lib/catalog/search";
import type { CatalogSearchIndex } from "@/lib/catalog/types";

// Generated once at build time and served as a static same-origin asset. Search
// matching remains in the browser; there is no query endpoint or runtime job.
export const dynamic = "force-static";

export function GET() {
  const index: CatalogSearchIndex = {
    categories: publishedCategories.map(({ name, slug }) => ({ name, slug })),
    tools: createToolSearchItems(publishedTools),
  };

  return Response.json(index, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
