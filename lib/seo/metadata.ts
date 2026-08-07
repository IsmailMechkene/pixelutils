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
  const socialImage = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${title} — PixelUtils`,
  };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
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

export function createCategoryMetadata(category: CategoryDefinition): Metadata {
  const canonical = `/categories/${category.slug}` as const;
  const title = `${category.name} tools`;

  return createPageMetadata({
    title,
    description: category.description,
    canonical,
  });
}
