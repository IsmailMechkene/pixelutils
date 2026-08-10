import { describe, expect, it } from "vitest";

import { acceptsFile } from "./acceptance";
import { formatFileSize, getFileTypeLabel } from "./format";

describe("formatFileSize", () => {
  it("formats bytes using compact, readable units", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1_536)).toBe("1.5 KB");
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10 MB");
  });

  it("does not report invalid sizes as a number", () => {
    expect(formatFileSize(-1)).toBe("Unknown size");
    expect(formatFileSize(Number.NaN)).toBe("Unknown size");
  });
});

describe("acceptsFile", () => {
  it("accepts MIME families, exact MIME types, and extensions", () => {
    expect(
      acceptsFile({ name: "photo.jpg", type: "image/jpeg" }, "image/*,.pdf"),
    ).toBe(true);
    expect(
      acceptsFile({ name: "document.PDF", type: "" }, "image/*,.pdf"),
    ).toBe(true);
    expect(
      acceptsFile(
        { name: "document.pdf", type: "application/pdf" },
        "application/pdf",
      ),
    ).toBe(true);
  });

  it("rejects files outside the accepted types", () => {
    expect(
      acceptsFile({ name: "notes.txt", type: "text/plain" }, "image/*,.pdf"),
    ).toBe(false);
  });
});

describe("getFileTypeLabel", () => {
  it("prefers the browser-provided MIME type", () => {
    expect(getFileTypeLabel({ name: "photo.png", type: "image/png" })).toBe(
      "image/png",
    );
  });

  it("falls back to the filename extension", () => {
    expect(getFileTypeLabel({ name: "document.PDF", type: "" })).toBe(
      ".PDF file",
    );
  });
});
