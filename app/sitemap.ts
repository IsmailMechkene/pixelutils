import type { MetadataRoute } from "next";

import {
  categoryRegistry,
  getToolsForCategory,
  publishedTools,
} from "@/lib/catalog/registry";
import { getSiteUrl } from "@/lib/site";

const staticPaths = ["", "/about", "/privacy", "/terms", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const toUrl = (path: string) => new URL(path || "/", siteUrl).toString();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: toUrl(path),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categoryRegistry
    .filter((category) => getToolsForCategory(category.slug).length > 0)
    .map((category) => ({
      url: toUrl(`/categories/${category.slug}`),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const toolEntries: MetadataRoute.Sitemap = publishedTools.map((tool) => ({
    url: toUrl(`/tools/${tool.slug}`),
    lastModified: tool.updatedAt,
    changeFrequency: "monthly",
    priority: tool.featured ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...toolEntries];
}
