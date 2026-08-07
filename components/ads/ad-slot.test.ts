import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/ads/config", () => ({
  adsConfig: { enabled: false, slots: {} },
}));

import { AdSlot } from "./ad-slot";

describe("AdSlot", () => {
  it("renders and reserves nothing with the default disabled configuration", () => {
    expect(AdSlot({ placement: "homepage-content" })).toBeNull();
    expect(AdSlot({ placement: "tool-after-content" })).toBeNull();
  });
});
