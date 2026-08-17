import { describe, expect, it } from "vitest";

import {
  createPdfPageEdits,
  getEditedPdfFilename,
  movePdfPageEdit,
  rotatePdfPageEdit,
} from "./logic";

describe("PDF page edit helpers", () => {
  it("creates one unrotated edit for each source page", () => {
    expect(createPdfPageEdits(3)).toEqual([
      { sourceIndex: 0, rotation: 0 },
      { sourceIndex: 1, rotation: 0 },
      { sourceIndex: 2, rotation: 0 },
    ]);
  });

  it("moves a page while preserving every page edit", () => {
    expect(
      movePdfPageEdit(createPdfPageEdits(3), 2, 0).map(
        (page) => page.sourceIndex,
      ),
    ).toEqual([2, 0, 1]);
  });

  it("rotates one page in quarter turns", () => {
    let pages = createPdfPageEdits(2);
    for (let step = 0; step < 3; step += 1) pages = rotatePdfPageEdit(pages, 1);
    expect(pages[1].rotation).toBe(270);
    expect(rotatePdfPageEdit(pages, 1)[1].rotation).toBe(0);
  });

  it("names the edited PDF safely", () => {
    expect(getEditedPdfFilename("report.final.pdf")).toBe(
      "report.final-edited.pdf",
    );
    expect(getEditedPdfFilename(".pdf")).toBe("document-edited.pdf");
  });
});
