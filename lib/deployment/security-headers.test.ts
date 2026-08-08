import { describe, expect, it } from "vitest";

import {
  contentSecurityPolicy,
  createSecurityHeaders,
  permissionsPolicy,
} from "./security-headers";

describe("production security headers", () => {
  it("applies transport and browser protections in production", () => {
    const headers = new Map(
      createSecurityHeaders(true).map(({ key, value }) => [key, value]),
    );

    expect(headers.get("Content-Security-Policy")).toBe(contentSecurityPolicy);
    expect(headers.get("Strict-Transport-Security")).toBe("max-age=31536000");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Permissions-Policy")).toBe(permissionsPolicy);
  });

  it("does not force HTTPS or a production CSP in local development", () => {
    const headerNames = createSecurityHeaders(false).map(({ key }) => key);

    expect(headerNames).not.toContain("Content-Security-Policy");
    expect(headerNames).not.toContain("Strict-Transport-Security");
  });

  it("keeps the CSP compatible with local tools without allowing frames", () => {
    expect(contentSecurityPolicy).toContain("worker-src 'self' blob:");
    expect(contentSecurityPolicy).toContain("img-src 'self' blob: data:");
    expect(contentSecurityPolicy).toContain("media-src 'self' blob:");
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
    expect(contentSecurityPolicy).toContain("script-src-attr 'none'");
  });
});
