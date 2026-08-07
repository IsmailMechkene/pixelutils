import { describe, expect, it } from "vitest";

import { resolveSiteUrl } from "./site";

describe("getSiteUrl", () => {
  it("accepts a configured HTTP(S) origin", () => {
    expect(
      resolveSiteUrl({ SITE_URL: "https://pixelutils.example" }).toString(),
    ).toBe("https://pixelutils.example/");
  });

  it("rejects malformed or path-based canonical configuration", () => {
    expect(() =>
      resolveSiteUrl({ SITE_URL: "https://pixelutils.example/tools" }),
    ).toThrow(/only an origin/);

    expect(() => resolveSiteUrl({ SITE_URL: "not a url" })).toThrow();
  });

  it("requires explicit configuration for every production build", () => {
    expect(() => resolveSiteUrl({ NODE_ENV: "production" })).toThrow(
      /SITE_URL is required/,
    );
  });

  it("requires HTTPS in production", () => {
    expect(() =>
      resolveSiteUrl({
        NODE_ENV: "production",
        SITE_URL: "http://pixelutils.example",
      }),
    ).toThrow(/HTTPS/);
  });
});
