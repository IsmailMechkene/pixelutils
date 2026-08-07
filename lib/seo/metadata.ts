import type { Metadata } from "next";

import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";

interface PageMetadataInput {
  title: string;
  description: string;
  canonical: `/${string}` | "/";
}

export function createPageMetadata({
  title,
  description,
  canonical,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function createToolMetadata(tool: ToolDefinition): Metadata {
  const canonical = `/tools/${tool.slug}` as const;

  return createPageMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    canonical,
  });
}

export function createCategoryMetadata(
  category: CategoryDefinition,
): Metadata {
  const canonical = `/categories/${category.slug}` as const;
  const title = `${category.name} tools`;

  return createPageMetadata({
    title,
    description: category.description,
    canonical,
  });
}
