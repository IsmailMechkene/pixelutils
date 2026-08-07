import { describe, expect, it } from "vitest";

import { normalizeSearchText, searchTools } from "./search";
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
