import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// PixelUtils currently uses only the adapter defaults. In particular, no R2
// cache or paid binding is required to serve the static-first application.
export default defineCloudflareConfig();
