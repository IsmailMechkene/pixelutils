import { describe, expect, it } from "vitest";

import { publishedTools } from "@/lib/catalog/registry";
import { isCatalogSearchIndex } from "@/lib/catalog/search";

import { GET } from "./route";

describe("static catalog search index", () => {
  it("is derived from every published tool without editorial payloads", async () => {
    const response = GET();
    const index: unknown = await response.json();

    expect(isCatalogSearchIndex(index)).toBe(true);
    if (!isCatalogSearchIndex(index)) return;
    expect(index.tools).toHaveLength(publishedTools.length);
    expect(Object.keys(index.tools[0] ?? {}).toSorted()).toEqual(
      [
        "aliases",
        "category",
        "keywords",
        "name",
        "searchWeight",
        "shortDescription",
        "slug",
      ].toSorted(),
    );
  });
});
