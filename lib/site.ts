export const siteConfig = {
  name: "PixelUtils",
  description:
    "Fast, private browser tools with no account required and no unnecessary uploads.",
  contactEmail: process.env.CONTACT_EMAIL?.trim() || null,
};

interface SiteEnvironment {
  SITE_URL?: string;
  NODE_ENV?: string;
}

export function resolveSiteUrl(environment: SiteEnvironment) {
  const configuredUrl = environment.SITE_URL;
  const value = configuredUrl;

  if (!value) {
    if (environment.NODE_ENV === "production") {
      throw new Error("SITE_URL is required for production canonical URLs.");
    }
    return new URL("http://localhost:3000");
  }

  const url = new URL(value);

  if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
    throw new Error("SITE_URL must be an HTTP(S) origin without credentials.");
  }

  if (environment.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use HTTPS in production.");
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      "SITE_URL must contain only an origin, without a path or query.",
    );
  }

  return url;
}

export function getSiteUrl() {
  return resolveSiteUrl(process.env);
}
