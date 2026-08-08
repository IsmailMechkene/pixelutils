import { describe, expect, it } from "vitest";

import {
  getNextSearchIndex,
  groupSearchResults,
  isCatalogSearchIndex,
  normalizeSearchText,
  searchTools,
} from "./search";
import type { ToolDefinition } from "./types";

const baseTool: ToolDefinition = {
  slug: "json-formatter",
  name: "JSON Formatter",
  shortDescription: "Format and validate JSON in your browser.",
  longDescription: "Format structured data without uploading it.",
  category: "developer",
  keywords: ["json", "format"],
  aliases: ["json beautifier"],
  icon: "braces",
  relatedTools: [],
  featured: true,
  searchWeight: 100,
  privacyNote: "Your JSON stays in this browser.",
  browserProcessing: true,
  sensitive: false,
  inputType: "structured-data",
  outputType: "structured-data",
  faqs: [],
  usageSteps: [],
  examples: [],
  publishedAt: "2026-08-07",
  updatedAt: "2026-08-07",
  seo: {
    title: "JSON Formatter",
    description: "Format JSON locally.",
  },
  status: "published",
};

describe("normalizeSearchText", () => {
  it("normalizes case and repeated whitespace", () => {
    expect(normalizeSearchText("  JSON   BEAUTIFIER ")).toBe("json beautifier");
  });
});

describe("catalog search index validation", () => {
  it("accepts the minimal serializable projection and rejects rich/invalid data", () => {
    expect(
      isCatalogSearchIndex({
        categories: [{ name: "Developer", slug: "developer" }],
        tools: [baseTool],
      }),
    ).toBe(true);
    expect(
      isCatalogSearchIndex({ categories: [], tools: [{ slug: "bad" }] }),
    ).toBe(false);
  });
});

describe("getNextSearchIndex", () => {
  it("wraps arrow navigation and supports Home and End", () => {
    expect(getNextSearchIndex(-1, 3, "ArrowDown")).toBe(0);
    expect(getNextSearchIndex(2, 3, "ArrowDown")).toBe(0);
    expect(getNextSearchIndex(0, 3, "ArrowUp")).toBe(2);
    expect(getNextSearchIndex(1, 3, "Home")).toBe(0);
    expect(getNextSearchIndex(1, 3, "End")).toBe(2);
  });

  it("returns no selection when there are no results", () => {
    expect(getNextSearchIndex(0, 0, "ArrowDown")).toBe(-1);
  });
});

describe("searchTools", () => {
  it("matches names, keywords, and aliases", () => {
    expect(searchTools([baseTool], "beautifier")).toEqual([baseTool]);
    expect(searchTools([baseTool], "JSON")).toEqual([baseTool]);
  });

  it("returns no tools for an unrelated query", () => {
    expect(searchTools([baseTool], "calculator")).toEqual([]);
  });

  it("returns all tools for an empty query", () => {
    expect(searchTools([baseTool], "   ")).toEqual([baseTool]);
  });

  it("filters by category without a backend", () => {
    expect(searchTools([baseTool], "json", { category: "text" })).toEqual([]);
    expect(searchTools([baseTool], "json", { category: "developer" })).toEqual([
      baseTool,
    ]);
  });

  it("ranks exact names and configured search weight deterministically", () => {
    const lowerWeight = {
      ...baseTool,
      slug: "json-minifier",
      name: "JSON Minifier",
      searchWeight: 1,
    };
    expect(searchTools([lowerWeight, baseTool], "JSON Formatter")).toEqual([
      baseTool,
    ]);
    expect(searchTools([lowerWeight, baseTool], "json")).toEqual([
      baseTool,
      lowerWeight,
    ]);
  });
});

describe("groupSearchResults", () => {
  it("keeps grouped visual order aligned with keyboard result indexes", () => {
    const textTool = {
      ...baseTool,
      slug: "word-counter",
      name: "Word Counter",
      category: "text" as const,
    };
    const groups = groupSearchResults(
      [textTool, baseTool],
      [
        { slug: "developer", name: "Developer" },
        { slug: "text", name: "Text" },
        { slug: "security", name: "Security" },
      ],
    );

    expect(groups.map((group) => group.name)).toEqual(["Text", "Developer"]);
    expect(
      groups.flatMap((group) => group.results.map(({ index }) => index)),
    ).toEqual([0, 1]);
  });
});
