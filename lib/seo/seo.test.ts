import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";
import { JsonLd } from "@/components/seo/json-ld";
import { publishedCategories, publishedTools } from "@/lib/catalog/registry";

import {
  createCategoryMetadata,
  createPageMetadata,
  createToolMetadata,
} from "./metadata";
import {
  createCategoryBreadcrumbData,
  createCategoryCollectionData,
  createToolApplicationData,
  createToolBreadcrumbData,
  createToolFaqData,
} from "./structured-data";
import { createSitemapEntries } from "./sitemap";
import { isValidCanonicalPath, validateSeoCatalog } from "./validation";

const category: CategoryDefinition = {
  slug: "developer",
  name: "Developer",
  shortDescription: "Developer tools.",
  description: "Tools for developer workflows.",
  selectionGuide: "Choose the tool that matches the developer task.",
  icon: "code",
  order: 1,
};

const tool: ToolDefinition = {
  slug: "json-formatter",
  name: "JSON Formatter",
  shortDescription: "Format JSON locally.",
  longDescription: "Format and validate JSON without uploading it.",
  category: "developer",
  keywords: ["json"],
  searchAliases: ["json beautifier"],
  icon: "code",
  relatedTools: [],
  featured: true,
  privacyNote: "Your JSON stays in this browser.",
  browserProcessing: true,
  sensitive: false,
  inputType: "structured-data",
  outputType: "structured-data",
  faqs: [{ question: "Is it local?", answer: "Yes." }],
  usageSteps: ["Paste JSON."],
  examples: [{ name: "Object", input: "{}", output: "{}" }],
  publishedAt: "2026-08-07",
  updatedAt: "2026-08-07",
  seo: {
    title: "JSON Formatter and Validator",
    description: "Format and validate JSON in your browser.",
  },
  status: "published",
};

describe("SEO metadata", () => {
  it("keeps the complete production SEO catalog valid", () => {
    expect(validateSeoCatalog(publishedTools, publishedCategories)).toEqual([]);
  });

  it("keeps canonical, Open Graph, and Twitter metadata aligned", () => {
    const metadata = createPageMetadata({
      title: "Privacy",
      description: "PixelUtils privacy information.",
      canonical: "/privacy",
    });

    expect(metadata.alternates).toEqual({ canonical: "/privacy" });
    expect(metadata.openGraph).toMatchObject({
      title: "Privacy",
      description: "PixelUtils privacy information.",
      url: "/privacy",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Privacy",
      description: "PixelUtils privacy information.",
      images: ["/opengraph-image"],
    });
    expect(metadata.openGraph).toMatchObject({
      images: [expect.objectContaining({ url: "/opengraph-image" })],
    });
  });

  it("uses the canonical tool path consistently", () => {
    expect(createToolMetadata(tool).alternates).toEqual({
      canonical: "/tools/json-formatter",
    });
  });

  it("uses a canonical category path consistently", () => {
    expect(createCategoryMetadata(category).alternates).toEqual({
      canonical: "/categories/developer",
    });
  });

  it("rejects collisions with static page metadata", () => {
    const conflictingTool = {
      ...tool,
      seo: { ...tool.seo, title: " About " },
    };

    expect(validateSeoCatalog([conflictingTool], [category])).toEqual(
      expect.arrayContaining([expect.stringMatching(/Duplicate SEO title/)]),
    );
  });

  it("rejects missing metadata and missing category pages", () => {
    const incompleteTool = {
      ...tool,
      seo: { title: "", description: "" },
    };

    expect(validateSeoCatalog([incompleteTool], [])).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Missing SEO title/),
        expect.stringMatching(/Missing SEO description/),
        expect.stringMatching(/no indexable category page/),
      ]),
    );
  });

  it("rejects empty category pages and duplicate canonical routes", () => {
    const duplicateRoute = {
      ...tool,
      name: "Second formatter",
      seo: {
        title: "Second formatter title",
        description: "A distinct description for the duplicate route fixture.",
      },
    };
    const issues = validateSeoCatalog([tool, duplicateRoute], [category]);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Duplicate canonical path/),
      ]),
    );
    expect(validateSeoCatalog([], [category])).toEqual(
      expect.arrayContaining([expect.stringMatching(/has no published tools/)]),
    );
  });

  it("accepts only normalized, query-free canonical paths", () => {
    expect(isValidCanonicalPath("/")).toBe(true);
    expect(isValidCanonicalPath("/tools/json-formatter")).toBe(true);
    expect(isValidCanonicalPath("/tools/json-formatter?view=compact")).toBe(
      false,
    );
    expect(isValidCanonicalPath("//example.com/tools/json")).toBe(false);
    expect(isValidCanonicalPath("/tools/json-formatter/")).toBe(false);
    expect(isValidCanonicalPath("/Tools/JSON")).toBe(false);
  });
});

describe("structured data", () => {
  it("cannot terminate its script element through registry content", () => {
    const html = renderToStaticMarkup(
      createElement(JsonLd, {
        data: { name: "</script><script>alert(1)</script>" },
      }),
    );

    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script>");
  });

  it("matches visible tool and FAQ content", () => {
    expect(createToolApplicationData(tool)).toMatchObject({
      name: tool.name,
      description: tool.shortDescription,
      datePublished: tool.publishedAt,
      dateModified: tool.updatedAt,
    });
    expect(createToolFaqData(tool)?.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Is it local?",
        acceptedAnswer: { "@type": "Answer", text: "Yes." },
      },
    ]);
  });

  it("keeps visible and structured breadcrumbs aligned", () => {
    const toolBreadcrumb = createToolBreadcrumbData(tool, category);
    const categoryBreadcrumb = createCategoryBreadcrumbData(category);

    expect(toolBreadcrumb.itemListElement.map((item) => item.name)).toEqual([
      "Home",
      "Developer",
      "JSON Formatter",
    ]);
    expect(categoryBreadcrumb.itemListElement.map((item) => item.name)).toEqual(
      ["Home", "Developer"],
    );
  });

  it("describes the visible category collection", () => {
    expect(createCategoryCollectionData(category, [tool])).toMatchObject({
      "@type": "CollectionPage",
      name: "Developer tools",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 1,
        itemListElement: [
          expect.objectContaining({ name: tool.name, position: 1 }),
        ],
      },
    });
  });

  it("omits FAQ structured data when no FAQ is visible", () => {
    expect(createToolFaqData({ ...tool, faqs: [] })).toBeUndefined();
  });
});

describe("sitemap", () => {
  it("contains public canonical routes and excludes draft tools", () => {
    const draft = {
      ...tool,
      slug: "draft-tool",
      name: "Draft tool",
      featured: false,
      status: "draft" as const,
      seo: {
        title: "Draft tool title",
        description: "Draft tool description that must not enter the sitemap.",
      },
    };
    const entries = createSitemapEntries(
      new URL("https://example.test"),
      [tool, draft],
      [category],
    );
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://example.test/");
    expect(urls).toContain("https://example.test/categories/developer");
    expect(urls).toContain("https://example.test/tools/json-formatter");
    expect(urls).not.toContain("https://example.test/tools/draft-tool");
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => !new URL(url).search)).toBe(true);
  });
});
