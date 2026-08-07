import type { MetadataRoute } from "next";

import { publishedCategories, publishedTools } from "@/lib/catalog/registry";
import { createSitemapEntries } from "@/lib/seo/sitemap";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemapEntries(
    getSiteUrl(),
    publishedTools,
    publishedCategories,
  );
}
