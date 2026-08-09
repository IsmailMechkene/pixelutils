import { describe, expect, it } from "vitest";

import { guideRegistry } from "./registry";
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
});
