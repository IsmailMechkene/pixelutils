import type { ToolDefinition, ToolSearchItem } from "./types";

export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export function createToolSearchItems(
  tools: readonly ToolDefinition[],
): ToolSearchItem[] {
  return tools.map(
    ({ slug, name, shortDescription, category, keywords, searchAliases }) => ({
      slug,
      name,
      shortDescription,
      category,
      keywords,
      searchAliases,
    }),
  );
}

export function searchTools<T extends ToolSearchItem>(
  tools: readonly T[],
  query: string,
): T[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [...tools];
  }

  return tools.filter((tool) => {
    const searchableText = [tool.name, ...tool.keywords, ...tool.searchAliases]
      .map(normalizeSearchText)
      .join(" ");

    return searchableText.includes(normalizedQuery);
  });
}

export function groupSearchResults<T extends ToolSearchItem>(
  results: readonly T[],
  categories: readonly { readonly name: string; readonly slug: string }[],
) {
  const indexedResults = results.map((tool, index) => ({ index, tool }));
  return categories
    .map((category) => ({
      ...category,
      results: indexedResults.filter(
        ({ tool }) => tool.category === category.slug,
      ),
    }))
    .filter((category) => category.results.length > 0);
}

export type SearchNavigationKey = "ArrowDown" | "ArrowUp" | "Home" | "End";

export function getNextSearchIndex(
  currentIndex: number,
  resultCount: number,
  key: SearchNavigationKey,
) {
  if (resultCount === 0) return -1;
  if (key === "Home") return 0;
  if (key === "End") return resultCount - 1;
  if (key === "ArrowDown")
    return (currentIndex + 1 + resultCount) % resultCount;
  return (currentIndex - 1 + resultCount) % resultCount;
}
