import type { MetadataRoute } from "next";

import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";
import type { GuideDefinition } from "@/lib/guides/types";

import { staticPageSeo } from "./static-pages";

export function createSitemapEntries(
  siteUrl: URL,
  tools: readonly ToolDefinition[],
  categories: readonly CategoryDefinition[],
  guides: readonly GuideDefinition[] = [],
): MetadataRoute.Sitemap {
  const publishedTools = tools.filter((tool) => tool.status === "published");
  const toUrl = (path: string) => new URL(path, siteUrl).toString();
  const staticEntries: MetadataRoute.Sitemap = Object.values(staticPageSeo).map(
    (page) => ({
      url: toUrl(page.canonical),
      changeFrequency: page.canonical === "/" ? "weekly" : "monthly",
      priority: page.canonical === "/" ? 1 : 0.5,
    }),
  );

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) =>
      publishedTools.some((tool) => tool.category === category.slug),
    )
    .map((category) => {
      const updatedDates = publishedTools
        .filter((tool) => tool.category === category.slug)
        .map((tool) => tool.updatedAt)
        .toSorted();

      return {
        url: toUrl(`/categories/${category.slug}`),
        lastModified: updatedDates.at(-1),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

  const toolEntries: MetadataRoute.Sitemap = publishedTools.map((tool) => ({
    url: toUrl(`/tools/${tool.slug}`),
    lastModified: tool.updatedAt,
    changeFrequency: "monthly",
    priority: tool.featured ? 0.9 : 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: toUrl(`/guides/${guide.slug}`),
    lastModified: guide.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...toolEntries, ...guideEntries];
}
