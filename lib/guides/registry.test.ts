import { describe, expect, it } from "vitest";

import {
  getGuidesForCategory,
  getGuidesForTool,
  guideRegistry,
} from "./registry";
import { findTool } from "@/lib/catalog/registry";
import type { GuideDefinition } from "./types";
import { validateGuideRegistry } from "./validation";

describe("guide registry", () => {
  it("keeps the published guides valid", () => {
    expect(validateGuideRegistry(guideRegistry)).toEqual([]);
  });

  it("rejects unknown tool and guide references", () => {
    const invalidGuide: GuideDefinition = {
      ...guideRegistry[0],
      primaryToolSlug: "missing-tool",
      relatedToolSlugs: ["also-missing"],
      relatedGuideSlugs: ["missing-guide"],
    };

    expect(validateGuideRegistry([invalidGuide])).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/unknown primary tool/),
        expect.stringMatching(/unknown tool/),
        expect.stringMatching(/invalid related-guide reference/),
      ]),
    );
  });

  it("rejects incomplete editorial content", () => {
    const incompleteGuide: GuideDefinition = {
      ...guideRegistry[0],
      slug: "incomplete-guide",
      title: "Incomplete guide",
      description: "A distinct guide description for a validation test.",
      sections: [],
    };

    expect(validateGuideRegistry([incompleteGuide])).toEqual(
      expect.arrayContaining([expect.stringMatching(/no editorial sections/)]),
    );
  });

  it("rejects duplicate section identifiers", () => {
    const duplicateSectionGuide: GuideDefinition = {
      ...guideRegistry[0],
      slug: "duplicate-section-guide",
      title: "Duplicate section guide",
      description: "A distinct guide description for duplicate-section validation.",
      sections: [guideRegistry[0].sections[0], guideRegistry[0].sections[0]],
    };

    expect(validateGuideRegistry([duplicateSectionGuide])).toEqual(
      expect.arrayContaining([expect.stringMatching(/duplicate section id/)]),
    );
  });

  it("keeps every guide reachable from its explicit tool and primary category", () => {
    for (const guide of guideRegistry) {
      const primaryTool = findTool(guide.primaryToolSlug);

      expect(primaryTool).toBeDefined();
      expect(getGuidesForTool(guide.primaryToolSlug)).toContainEqual(guide);
      expect(getGuidesForCategory(primaryTool!.category)).toContainEqual(guide);

      for (const toolSlug of guide.relatedToolSlugs) {
        expect(getGuidesForTool(toolSlug)).toContainEqual(guide);
      }
    }
  });
});
