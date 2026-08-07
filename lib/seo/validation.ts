import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";

import { staticPageSeo } from "./static-pages";

interface SeoEntry {
  id: string;
  title: string;
  description: string;
}

const staticSeoEntries: readonly SeoEntry[] = Object.entries(staticPageSeo).map(
  ([id, metadata]) => ({ id, ...metadata }),
);

function normalize(value: string) {
  return value.normalize("NFKC").trim().toLowerCase();
}

function duplicateValues(entries: readonly SeoEntry[], field: "title" | "description") {
  const owners = new Map<string, string[]>();
  for (const entry of entries) {
    const key = normalize(entry[field]);
    owners.set(key, [...(owners.get(key) ?? []), entry.id]);
  }
  return [...owners.entries()].filter(([, ids]) => ids.length > 1);
}

export function validateSeoCatalog(
  tools: readonly ToolDefinition[],
  categories: readonly CategoryDefinition[],
) {
  const entries: SeoEntry[] = [
    ...staticSeoEntries,
    ...tools.map((tool) => ({
      id: `tool:${tool.slug}`,
      title: tool.seo.title,
      description: tool.seo.description,
    })),
    ...categories.map((category) => ({
      id: `category:${category.slug}`,
      title: `${category.name} tools`,
      description: category.description,
    })),
  ];

  return [
    ...duplicateValues(entries, "title").map(
      ([value, ids]) => `Duplicate SEO title "${value}" on ${ids.join(", ")}.`,
    ),
    ...duplicateValues(entries, "description").map(
      ([value, ids]) => `Duplicate SEO description "${value}" on ${ids.join(", ")}.`,
    ),
  ];
}

export function assertValidSeoCatalog(
  tools: readonly ToolDefinition[],
  categories: readonly CategoryDefinition[],
) {
  const issues = validateSeoCatalog(tools, categories);
  if (issues.length > 0) {
    throw new Error(`Invalid SEO catalog:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
  }
}
