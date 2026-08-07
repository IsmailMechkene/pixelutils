import { describe, expect, it } from "vitest";

import { categoryRegistry, toolRegistry } from "./registry";

describe("catalog registry", () => {
  it("uses unique category slugs", () => {
    const slugs = categoryRegistry.map((category) => category.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps every tool category and related tool reference valid", () => {
    const categories = new Set<string>(
      categoryRegistry.map((category) => category.slug),
    );
    const toolSlugs = new Set(toolRegistry.map((tool) => tool.slug));

    for (const tool of toolRegistry) {
      expect(categories.has(tool.category)).toBe(true);
      expect(tool.relatedTools.every((slug) => toolSlugs.has(slug))).toBe(true);
    }
  });
});
