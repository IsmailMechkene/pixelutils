export interface ResponseHeader {
  readonly key: string;
  readonly value: string;
}

export const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  // Next.js bootstrapping and the pre-hydration theme initializer use inline
  // scripts. A nonce-based policy would require per-request rendering and is
  // intentionally avoided while the site remains static-first.
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  // A few tool controls use React style properties for user-selected colors.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

// The FFmpeg core compiles WASM in its own same-origin worker. Keep this
// exception route-scoped instead of weakening the site-wide policy.
export const ffmpegContentSecurityPolicy = contentSecurityPolicy.replace(
  "script-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
);

export const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "browsing-topics=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

export function createSecurityHeaders(isProduction: boolean): ResponseHeader[] {
  const headers: ResponseHeader[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    { key: "Permissions-Policy", value: permissionsPolicy },
  ];

  if (isProduction) {
    headers.push(
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000",
      },
    );
  }

  return headers;
}

export function createFfmpegSecurityHeaders(
  isProduction: boolean,
): ResponseHeader[] {
  return createSecurityHeaders(isProduction).map((header) =>
    header.key === "Content-Security-Policy"
      ? { ...header, value: ffmpegContentSecurityPolicy }
      : header,
  );
}
