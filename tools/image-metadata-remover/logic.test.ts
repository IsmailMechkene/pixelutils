import { expect, it } from "vitest";

import { getMetadataRemovedFilename } from "./logic";

it("creates a sensible sanitized image filename", () => {
  expect(getMetadataRemovedFilename("holiday.photo.JPEG", "image/jpeg")).toBe(
    "holiday.photo-sanitized.jpg",
  );
  expect(getMetadataRemovedFilename(".png", "image/png")).toBe(
    "image-sanitized.png",
  );
});
