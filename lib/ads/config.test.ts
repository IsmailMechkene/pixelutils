import { describe, expect, it } from "vitest";

import { resolveAdsConfig } from "./config";

describe("advertising configuration", () => {
  it("stays disabled without an explicit provider", () => {
    expect(resolveAdsConfig({ ADS_ENABLED: "true" }).enabled).toBe(false);
  });

  it("keeps placement identifiers separate and optional", () => {
    expect(
      resolveAdsConfig({
        ADS_ENABLED: "true",
        ADS_PROVIDER: "future-provider",
        AD_SLOT_HOMEPAGE_CONTENT: "home-slot",
      }),
    ).toEqual({
      enabled: true,
      providerId: "future-provider",
      slots: {
        "category-content": undefined,
        "homepage-content": "home-slot",
        sidebar: undefined,
        "tool-after-content": undefined,
      },
    });
  });
});
