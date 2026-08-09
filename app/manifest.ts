import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PixelUtils",
    short_name: "PixelUtils",
    description: "Fast, private browser tools with no account required.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#3a31e7",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
