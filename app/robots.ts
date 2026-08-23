import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

const publicCrawlerRules = {
  allow: ["/"],
  disallow: ["/api/"],
};

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        ...publicCrawlerRules,
        // This is a voluntary Content Signals declaration. Individual crawler
        // policies, such as Google-Extended, may offer different controls.
        other: {
          "Content-Signal": "search=yes,ai-train=no,use=reference",
        },
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "OAI-SearchBot",
          "Google-Extended",
          "ClaudeBot",
          "PerplexityBot",
        ],
        ...publicCrawlerRules,
      },
      {
        // GPTBot is OpenAI's training crawler, distinct from OAI-SearchBot.
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
