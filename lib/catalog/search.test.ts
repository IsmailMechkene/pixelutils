import { describe, expect, it } from "vitest";

import { getNextSearchIndex, normalizeSearchText, searchTools } from "./search";
import type { ToolDefinition } from "./types";

const baseTool: ToolDefinition = {
  slug: "json-formatter",
  name: "JSON Formatter",
  shortDescription: "Format and validate JSON in your browser.",
  longDescription: "Format structured data without uploading it.",
  category: "developer",
  keywords: ["json", "format"],
  searchAliases: ["json beautifier"],
  icon: "code",
  relatedTools: [],
  featured: true,
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
});
