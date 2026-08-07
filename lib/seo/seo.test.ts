import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";
import { JsonLd } from "@/components/seo/json-ld";

import { createPageMetadata, createToolMetadata } from "./metadata";
import {
  createCategoryBreadcrumbData,
  createToolApplicationData,
  createToolBreadcrumbData,
  createToolFaqData,
} from "./structured-data";
import { validateSeoCatalog } from "./validation";

const category: CategoryDefinition = {
  slug: "developer",
  name: "Developer",
  shortDescription: "Developer tools.",
  description: "Tools for developer workflows.",
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
      title: "Privacy",
      description: "PixelUtils privacy information.",
    });
  });

  it("uses the canonical tool path consistently", () => {
    expect(createToolMetadata(tool).alternates).toEqual({
      canonical: "/tools/json-formatter",
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
    expect(categoryBreadcrumb.itemListElement.map((item) => item.name)).toEqual([
      "Home",
      "Developer",
    ]);
  });
});
