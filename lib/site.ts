export const siteConfig = {
  name: "PixelUtils",
  description:
    "Fast, private browser tools with no account required and no unnecessary uploads.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@pixelutils.app",
};

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const value = configuredUrl ?? (vercelUrl ? `https://${vercelUrl}` : undefined);

  try {
    return new URL(value ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}
