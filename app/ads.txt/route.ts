export const dynamic = "force-static";

export function GET() {
  return new Response(
    "# PixelUtils does not currently authorize any advertising sellers.\n# Add verified provider records here before enabling advertisements.\n",
    {
      headers: {
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
