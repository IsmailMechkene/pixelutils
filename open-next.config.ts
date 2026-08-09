import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import incrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The static-assets cache lets the Worker serve Next's build-time prerendered
// routes (including generateStaticParams paths) from the deployed asset bundle.
// It needs no R2, KV, database, or paid binding.
export default defineCloudflareConfig({
  incrementalCache,
});
