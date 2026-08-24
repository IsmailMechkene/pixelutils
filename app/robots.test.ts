import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots.txt policy", () => {
  it("allows public search and grounding crawlers while blocking GPTBot", () => {
    const rules = robots().rules;

    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: "*",
          allow: ["/"],
          disallow: ["/api/"],
          other: {
            "Content-Signal": "search=yes,ai-train=no,use=reference",
          },
        }),
        expect.objectContaining({
          userAgent: expect.arrayContaining([
            "Googlebot",
            "Bingbot",
            "OAI-SearchBot",
            "Google-Extended",
            "ClaudeBot",
            "PerplexityBot",
          ]),
          allow: ["/"],
          disallow: ["/api/"],
        }),
        expect.objectContaining({
          userAgent: "GPTBot",
          disallow: ["/"],
        }),
      ]),
    );
  });

  it("publishes the configured sitemap URL", () => {
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

    expect(robots().sitemap).toBe(
      new URL("/sitemap.xml", siteUrl).toString(),
    );
  });
});
