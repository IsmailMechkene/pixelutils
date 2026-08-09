import type { NextConfig } from "next";

import { createSecurityHeaders } from "./lib/deployment/security-headers";

const isProduction = process.env.NODE_ENV === "production";
const securityHeaders = createSecurityHeaders(isProduction);

const nextConfig: NextConfig = {
  trailingSlash: false,
  // The local preview bridge reaches this server through this explicit host.
  // Next.js blocks cross-origin dev chunks and HMR by default unless the
  // preview host is trusted. This is development-only and intentionally not a
  // broad private-network wildcard.
  allowedDevOrigins: ["172.23.96.1"],
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
