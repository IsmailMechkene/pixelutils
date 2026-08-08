import type {
  CatalogSearchIndex,
  ToolDefinition,
  ToolSearchItem,
} from "./types";

export const ALL_CATEGORIES = "all" as const;

export interface ToolSearchOptions {
  readonly category?: string;
  readonly limit?: number;
}

export function isCatalogSearchIndex(
  value: unknown,
): value is CatalogSearchIndex {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CatalogSearchIndex>;
  if (!Array.isArray(candidate.categories) || !Array.isArray(candidate.tools)) {
    return false;
  }
  return (
    (candidate.categories as unknown[]).every((categoryValue) => {
      if (!categoryValue || typeof categoryValue !== "object") return false;
      const category = categoryValue as Record<string, unknown>;
      return (
        typeof category.name === "string" && typeof category.slug === "string"
      );
    }) &&
    (candidate.tools as unknown[]).every((toolValue) => {
      if (!toolValue || typeof toolValue !== "object") return false;
      const tool = toolValue as Record<string, unknown>;
      return (
        typeof tool.slug === "string" &&
        typeof tool.name === "string" &&
        typeof tool.shortDescription === "string" &&
        typeof tool.category === "string" &&
        Array.isArray(tool.keywords) &&
        tool.keywords.every(
          (keyword: unknown) => typeof keyword === "string",
        ) &&
        Array.isArray(tool.aliases) &&
        tool.aliases.every((alias: unknown) => typeof alias === "string") &&
        Number.isInteger(tool.searchWeight)
      );
    })
  );
}

export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export function createToolSearchItems(
  tools: readonly ToolDefinition[],
): ToolSearchItem[] {
  return tools.map(
    ({
      slug,
      name,
      shortDescription,
      category,
      keywords,
      aliases,
      searchWeight,
    }) => ({
      slug,
      name,
      shortDescription,
      category,
      keywords,
      aliases,
      searchWeight,
    }),
  );
}

function fieldScore(value: string, query: string, weights: readonly number[]) {
  const normalizedValue = normalizeSearchText(value);
  if (normalizedValue === query) return weights[0] ?? 0;
  if (normalizedValue.startsWith(query)) return weights[1] ?? 0;
  if (normalizedValue.includes(query)) return weights[2] ?? 0;
  return 0;
}

export function scoreToolSearch(tool: ToolSearchItem, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return tool.searchWeight;

  const tokens = normalizedQuery.split(" ");
  const searchableValues = [tool.name, ...tool.aliases, ...tool.keywords];
  if (
    !tokens.every((token) =>
      searchableValues.some((value) =>
        normalizeSearchText(value).includes(token),
      ),
    )
  ) {
    return -1;
  }

  return (
    tool.searchWeight +
    fieldScore(tool.name, normalizedQuery, [160, 120, 80]) +
    Math.max(
      0,
      ...tool.aliases.map((alias) =>
        fieldScore(alias, normalizedQuery, [120, 90, 60]),
      ),
    ) +
    Math.max(
      0,
      ...tool.keywords.map((keyword) =>
        fieldScore(keyword, normalizedQuery, [80, 60, 40]),
      ),
    )
  );
}

export function searchTools<T extends ToolSearchItem>(
  tools: readonly T[],
  query: string,
  options: ToolSearchOptions = {},
): T[] {
  const normalizedQuery = normalizeSearchText(query);
  const category = options.category;
  const ranked = tools
    .filter(
      (tool) =>
        !category || category === ALL_CATEGORIES || tool.category === category,
    )
    .map((tool, index) => ({
      index,
      score: scoreToolSearch(tool, normalizedQuery),
      tool,
    }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ tool }) => tool);

  return options.limit === undefined ? ranked : ranked.slice(0, options.limit);
}

export function groupSearchResults<T extends ToolSearchItem>(
  results: readonly T[],
  categories: readonly { readonly name: string; readonly slug: string }[],
) {
  const categoryNames = new Map(
    categories.map((category) => [category.slug, category.name]),
  );
  const grouped = new Map<
    string,
    {
      name: string;
      slug: string;
      results: { index: number; tool: T }[];
    }
  >();

  results.forEach((tool, index) => {
    const existing = grouped.get(tool.category);
    const result = { index, tool };
    if (existing) {
      existing.results.push(result);
      return;
    }

    grouped.set(tool.category, {
      name: categoryNames.get(tool.category) ?? tool.category,
      slug: tool.category,
      results: [result],
    });
  });

  // Preserve ranked result order across category groups so visual order and
  // arrow-key selection always describe the same item.
  return [...grouped.values()];
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
