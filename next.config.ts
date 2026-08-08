import type { NextConfig } from "next";

import { createSecurityHeaders } from "./lib/deployment/security-headers";

const isProduction = process.env.NODE_ENV === "production";
const securityHeaders = createSecurityHeaders(isProduction);

const nextConfig: NextConfig = {
  trailingSlash: false,
  // Codex's preview browser reaches the local dev server through this bridge
  // address. Next.js blocks cross-site dev chunks and HMR by default unless
  // the preview host is explicitly trusted. This option is development-only
  // and does not relax production security headers. Keep the bridge explicit
  // instead of allowing a broad private-network wildcard.
  allowedDevOrigins: ["172.31.0.1"],
  poweredByHeader: false,
  productionBrowserSourceMaps:
    process.env.ENABLE_BROWSER_SOURCE_MAPS === "true",
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
