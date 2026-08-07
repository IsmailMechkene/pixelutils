import { siteConfig } from "@/lib/site";

export const staticPageSeo = {
  home: {
    title: "PixelUtils \u2014 Fast, private browser tools",
    description: siteConfig.description,
    canonical: "/",
  },
  about: {
    title: "About",
    description:
      "Why PixelUtils is building a calmer, faster, and more private collection of browser tools.",
    canonical: "/about",
  },
  contact: {
    title: "Contact",
    description: "Contact PixelUtils with feedback or a verified tool issue.",
    canonical: "/contact",
  },
  privacy: {
    title: "Privacy",
    description:
      "How PixelUtils approaches local browser processing, storage, analytics, and advertising.",
    canonical: "/privacy",
  },
  terms: {
    title: "Terms",
    description: "Terms for using the free PixelUtils browser tools.",
    canonical: "/terms",
  },
} as const;
