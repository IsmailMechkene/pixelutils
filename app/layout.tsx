import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { publishedCategories, publishedTools } from "@/lib/catalog/registry";
import { staticPageSeo } from "@/lib/seo/static-pages";
import { assertValidSeoCatalog } from "@/lib/seo/validation";

import "./globals.css";

const themeScript = `(()=>{try{const key="pixelutils-theme";const stored=localStorage.getItem(key);const preference=stored==="light"||stored==="dark"||stored==="system"?stored:"system";const resolved=preference==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):preference;document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved}catch{}})();`;

assertValidSeoCatalog(publishedTools, publishedCategories);

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: staticPageSeo.home.title,
    template: "%s | PixelUtils",
  },
  description: staticPageSeo.home.description,
  applicationName: siteConfig.name,
  alternates: { canonical: staticPageSeo.home.canonical },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: staticPageSeo.home.title,
    description: staticPageSeo.home.description,
    url: staticPageSeo.home.canonical,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PixelUtils — Fast, private browser tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: staticPageSeo.home.title,
    description: staticPageSeo.home.description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#171817" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-screen bg-canvas text-ink antialiased"
        suppressHydrationWarning
      >
        <a
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1" id="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
