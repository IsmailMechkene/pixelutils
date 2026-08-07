import type { ToolDefinition } from "./types";

export function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function searchTools(
  tools: readonly ToolDefinition[],
  query: string,
): ToolDefinition[] {
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
