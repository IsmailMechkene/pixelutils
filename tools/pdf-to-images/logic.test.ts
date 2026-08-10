import { describe, expect, it } from "vitest";

import { getPdfImageFilename, validatePdfRenderPlan, validateRenderPixels } from "./logic";

describe("PDF to image helpers", () => {
  it("creates a sensible page filename", () => {
    expect(getPdfImageFilename("report.final.PDF", 3, "image/jpeg")).toBe("report.final-page-3.jpg");
  });

  it("rejects excessive and invalid render plans", () => {
    expect(validatePdfRenderPlan([1, 6], 5)).toBe("Choose pages between 1 and 5.");
    expect(validatePdfRenderPlan([], 5)).toBe("Select at least one page.");
    expect(validateRenderPixels(6000, 4000)).toContain("20 megapixels");
  });
});
