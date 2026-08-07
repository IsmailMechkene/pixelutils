import { describe, expect, it } from "vitest";

import { toolWorkspaceSlugs } from "@/tools/workspace-registry";

import { categoryRegistry, toolRegistry } from "./registry";
import type { ToolDefinition } from "./types";
import { validateRegistry } from "./validation";

function createTool(overrides: Partial<ToolDefinition> = {}): ToolDefinition {
  return {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Format and validate JSON locally.",
    longDescription: "Format structured data without uploading it.",
    category: "developer",
    keywords: ["json", "format"],
    searchAliases: ["json beautifier"],
    icon: "braces",
    relatedTools: [],
    featured: true,
    popularRank: 1,
    privacyNote: "Your JSON stays in this browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "structured-data",
    outputType: "structured-data",
    faqs: [
      {
        question: "Does this upload JSON?",
        answer: "No. Formatting happens in your browser.",
      },
    ],
    usageSteps: ["Paste JSON.", "Format it."],
    examples: [{ name: "Object", input: '{"a":1}', output: '{\n  "a": 1\n}' }],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "JSON Formatter and Validator",
      description: "Format and validate JSON locally in your browser.",
    },
    status: "published",
    ...overrides,
  };
}

describe("catalog registry", () => {
  it("keeps the production registry valid", () => {
    expect(
      validateRegistry(categoryRegistry, toolRegistry, toolWorkspaceSlugs),
    ).toEqual([]);
  });

  it("fails a broken related-tool reference", () => {
    const tool = createTool({ relatedTools: ["missing-tool"] });
    const issues = validateRegistry(categoryRegistry, [tool], [tool.slug]);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "broken-related-tool" }),
      ]),
    );
  });

  it("fails duplicate tool slugs and published metadata", () => {
    const first = createTool();
    const duplicate = createTool();
    const issues = validateRegistry(
      categoryRegistry,
      [first, duplicate],
      [first.slug],
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-tool-slug" }),
        expect.objectContaining({ code: "duplicate-tool-name" }),
        expect.objectContaining({ code: "duplicate-seo-title" }),
        expect.objectContaining({ code: "duplicate-seo-description" }),
      ]),
    );
  });

  it("normalizes metadata before checking uniqueness", () => {
    const first = createTool();
    const second = createTool({
      slug: "json-minifier",
      name: "JSON Minifier",
      seo: {
        title: `  ${first.seo.title.toUpperCase()}  `,
        description: first.seo.description.toUpperCase(),
      },
    });
    const issues = validateRegistry(
      categoryRegistry,
      [first, second],
      [first.slug, second.slug],
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-seo-title" }),
        expect.objectContaining({ code: "duplicate-seo-description" }),
      ]),
    );
  });

  it("requires every published tool to have a lazy workspace", () => {
    const tool = createTool();
    const issues = validateRegistry(categoryRegistry, [tool], []);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing-workspace" }),
      ]),
    );
  });

  it("rejects an unpublished related tool on a published page", () => {
    const draft = createTool({
      slug: "json-minifier",
      name: "JSON Minifier",
      featured: false,
      popularRank: undefined,
      status: "draft",
      seo: {
        title: "JSON Minifier",
        description: "Minify JSON locally in your browser.",
      },
    });
    const published = createTool({ relatedTools: [draft.slug] });
    const issues = validateRegistry(
      categoryRegistry,
      [published, draft],
      [published.slug],
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "related-tool-unpublished" }),
      ]),
    );
  });

  it("rejects invalid dates and update order", () => {
    const tool = createTool({
      publishedAt: "2026-09-01",
      updatedAt: "2026-08-01",
    });
    const issues = validateRegistry(categoryRegistry, [tool], [tool.slug]);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-date-order" }),
      ]),
    );
  });

  it("rejects a workspace without a registry definition", () => {
    const issues = validateRegistry(categoryRegistry, [], ["orphan-workspace"]);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unknown-workspace" }),
      ]),
    );
  });
});
