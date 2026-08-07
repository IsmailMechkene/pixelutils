import type { Metadata } from "next";

import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";

export function createToolMetadata(tool: ToolDefinition): Metadata {
  const canonical = `/tools/${tool.slug}`;

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: tool.seo.title,
      description: tool.seo.description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export function createCategoryMetadata(
  category: CategoryDefinition,
  toolCount: number,
): Metadata {
  const canonical = `/categories/${category.slug}`;
  const title = `${category.name} tools`;

  return {
    title,
    description: category.description,
    alternates: { canonical },
    robots: toolCount > 0 ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      title,
      description: category.description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description: category.description,
    },
  };
}
