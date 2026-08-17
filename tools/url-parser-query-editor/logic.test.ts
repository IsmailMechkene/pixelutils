import { describe, expect, it } from "vitest";

import { buildUrl, moveQueryParameter, parseUrl } from "./logic";

describe("URL parser and query editor", () => {
  it("parses URL components and duplicate query keys", () => {
    const result = parseUrl(
      "https://user:secret@example.com:8080/a/b?tag=one&tag=two#details",
    );
    expect(result).toEqual({
      ok: true,
      value: {
        protocol: "https",
        host: "example.com:8080",
        hostname: "example.com",
        port: "8080",
        path: "/a/b",
        hash: "details",
        hasCredentials: true,
        query: [
          { key: "tag", value: "one" },
          { key: "tag", value: "two" },
        ],
      },
    });
  });

  it("rebuilds query strings with percent encoding", () => {
    const result = buildUrl("https://example.com/search#top", [
      { key: "q", value: "coffee & tea" },
    ]);
    expect(result.ok && result.output).toBe(
      "https://example.com/search?q=coffee+%26+tea#top",
    );
  });

  it("moves query parameters and rejects relative URLs", () => {
    expect(
      moveQueryParameter(
        [
          { key: "a", value: "1" },
          { key: "b", value: "2" },
        ],
        1,
        0,
      ),
    ).toEqual([
      { key: "b", value: "2" },
      { key: "a", value: "1" },
    ]);
    expect(parseUrl("/relative").ok).toBe(false);
  });
});
