import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("ads.txt placeholder", () => {
  it("contains no invented publisher record", async () => {
    const response = GET();
    const body = await response.text();
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("does not currently authorize");
    expect(body).not.toMatch(/pub-\d+/i);
    expect(body).not.toMatch(/DIRECT|RESELLER/);
  });
});
