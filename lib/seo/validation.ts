import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";

import { staticPageSeo } from "./static-pages";

interface SeoEntry {
  id: string;
  title: string;
  description: string;
  canonical: string;
}

const staticSeoEntries: readonly SeoEntry[] = Object.entries(staticPageSeo).map(
  ([id, metadata]) => ({ id, ...metadata }),
);

function normalize(value: string) {
  return value.normalize("NFKC").trim().toLowerCase();
}

export function isValidCanonicalPath(path: string) {
  if (path === "/") return true;
  return /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(
    path,
  );
}

function duplicateValues(
  entries: readonly SeoEntry[],
  field: "title" | "description" | "canonical",
) {
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
      canonical: `/tools/${tool.slug}`,
    })),
    ...categories.map((category) => ({
      id: `category:${category.slug}`,
      title: `${category.name} tools`,
      description: category.description,
      canonical: `/categories/${category.slug}`,
    })),
  ];

  const categorySlugs = new Set(categories.map((category) => category.slug));

  return [
    ...entries.flatMap((entry) => {
      const issues: string[] = [];
      if (!entry.title.trim()) issues.push(`Missing SEO title on ${entry.id}.`);
      if (!entry.description.trim())
        issues.push(`Missing SEO description on ${entry.id}.`);
      if (!isValidCanonicalPath(entry.canonical))
        issues.push(
          `Invalid canonical path "${entry.canonical}" on ${entry.id}.`,
        );
      return issues;
    }),
    ...duplicateValues(entries, "title").map(
      ([value, ids]) => `Duplicate SEO title "${value}" on ${ids.join(", ")}.`,
    ),
    ...duplicateValues(entries, "description").map(
      ([value, ids]) =>
        `Duplicate SEO description "${value}" on ${ids.join(", ")}.`,
    ),
    ...duplicateValues(entries, "canonical").map(
      ([value, ids]) =>
        `Duplicate canonical path "${value}" on ${ids.join(", ")}.`,
    ),
    ...tools
      .filter((tool) => !categorySlugs.has(tool.category))
      .map(
        (tool) =>
          `Published tool "${tool.slug}" has no indexable category page.`,
      ),
    ...categories
      .filter(
        (category) => !tools.some((tool) => tool.category === category.slug),
      )
      .map(
        (category) =>
          `Category page "${category.slug}" has no published tools.`,
      ),
  ];
}

export function assertValidSeoCatalog(
  tools: readonly ToolDefinition[],
  categories: readonly CategoryDefinition[],
) {
  const issues = validateSeoCatalog(tools, categories);
  if (issues.length > 0) {
    throw new Error(
      `Invalid SEO catalog:\n${issues.map((issue) => `- ${issue}`).join("\n")}`,
    );
  }
}
