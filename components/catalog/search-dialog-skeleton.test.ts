import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  SearchDialogSkeleton,
  SearchResultsSkeleton,
} from "./search-dialog-skeleton";

describe("search dialog skeleton", () => {
  it("announces loading without exposing fake controls", () => {
    const markup = renderToStaticMarkup(SearchDialogSkeleton());

    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("Loading search");
    expect(markup).toContain("motion-reduce:animate-none");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain('role="option"');
  });

  it("provides a results-level status for the catalog fetch", () => {
    const markup = renderToStaticMarkup(SearchResultsSkeleton());

    expect(markup).toContain('role="status"');
    expect(markup).toContain("Loading tool catalog");
  });
});
