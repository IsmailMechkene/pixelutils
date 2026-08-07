import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(path)
      : extname(entry.name) === ".tsx"
        ? [path]
        : [];
  });
}

describe("design system boundaries", () => {
  it("keeps visual scales out of arbitrary Tailwind values", () => {
    const forbiddenVisualUtilities =
      /(?:rounded|shadow|tracking|duration|size|text|transition)-\[[^\]]+\]/g;
    const violations = ["app", "components", "tools"].flatMap((directory) =>
      sourceFiles(directory).flatMap((file) => {
        const matches = readFileSync(file, "utf8").match(
          forbiddenVisualUtilities,
        );
        return matches?.map((match) => `${file}: ${match}`) ?? [];
      }),
    );

    expect(violations).toEqual([]);
  });

  it("defines the shared semantic radius, shadow, and motion tokens", () => {
    const styles = readFileSync("app/globals.css", "utf8");
    for (const token of [
      "--radius-control",
      "--radius-card",
      "--shadow-card",
      "--shadow-overlay",
      "--motion-fast",
      "--motion-standard",
      "--motion-deliberate",
    ]) {
      expect(styles).toContain(token);
    }
  });
});
