import type { NextConfig } from "next";

import {
  createFfmpegSecurityHeaders,
  createSecurityHeaders,
} from "./lib/deployment/security-headers";

const isProduction = process.env.NODE_ENV === "production";
const securityHeaders = createSecurityHeaders(isProduction);
const ffmpegSecurityHeaders = createFfmpegSecurityHeaders(isProduction);
const internalFfmpegPrototypeEnabled =
  process.env.NEXT_PUBLIC_ENABLE_INTERNAL_FFMPEG_PROTOTYPE === "true";

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
  env: {
    NEXT_PUBLIC_ENABLE_INTERNAL_FFMPEG_PROTOTYPE:
      internalFfmpegPrototypeEnabled ? "true" : "false",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/internal/ffmpeg-prototype/:path*",
        headers: ffmpegSecurityHeaders,
      },
      {
        source: "/tools/mkv-to-mp4/:path*",
        headers: ffmpegSecurityHeaders,
      },
      {
        source: "/wasm/media/ffmpeg/:path*",
        headers: ffmpegSecurityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/categories/image-conversion",
        destination: "/categories/image",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
