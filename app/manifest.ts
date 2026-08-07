import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PixelUtils",
    short_name: "PixelUtils",
    description: "Fast, private browser tools with no account required.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f8",
    theme_color: "#5b4de8",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
