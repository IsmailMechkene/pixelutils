import type { ToolDefinition, ToolSearchItem } from "./types";

export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export function createToolSearchItems(
  tools: readonly ToolDefinition[],
): ToolSearchItem[] {
  return tools.map(({ slug, name, shortDescription, keywords, searchAliases }) => ({
    slug,
    name,
    shortDescription,
    keywords,
    searchAliases,
  }));
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
    const searchableText = [
      tool.name,
      ...tool.keywords,
      ...tool.searchAliases,
    ]
      .map(normalizeSearchText)
      .join(" ");

    return searchableText.includes(normalizedQuery);
  });
}
