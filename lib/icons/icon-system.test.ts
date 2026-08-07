import { describe, expect, it } from "vitest";

import { categoryRegistry, toolRegistry } from "@/lib/catalog/registry";

import { actionIcons } from "./action-icons";
import { categoryIcons } from "./category-icons";
import { toolIcons } from "./tool-icons";
import { actionIconIds, categoryIconIds, toolIconIds } from "./types";

describe("icon system", () => {
  it("maps every stable identifier exactly once", () => {
    expect(Object.keys(toolIcons)).toEqual([...toolIconIds]);
    expect(Object.keys(categoryIcons)).toEqual([...categoryIconIds]);
    expect(Object.keys(actionIcons)).toEqual([...actionIconIds]);
    expect(new Set(toolIconIds).size).toBe(toolIconIds.length);
    expect(new Set(categoryIconIds).size).toBe(categoryIconIds.length);
    expect(new Set(actionIconIds).size).toBe(actionIconIds.length);
  });

  it("resolves every registry icon through the centralized maps", () => {
    for (const tool of toolRegistry) {
      expect(toolIcons[tool.icon], tool.slug).toBeDefined();
    }
    for (const category of categoryRegistry) {
      expect(categoryIcons[category.icon], category.slug).toBeDefined();
    }
  });
});
