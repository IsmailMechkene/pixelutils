import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const wranglerConfig = await readFile(join(root, "wrangler.jsonc"), "utf8");
const siteUrlMatch = wranglerConfig.match(
  /"SITE_URL"\s*:\s*"(?<siteUrl>https:\/\/[^"\s]+)"/,
);
const siteUrl = siteUrlMatch?.groups?.siteUrl;

if (!siteUrl) {
  throw new Error(
    "wrangler.jsonc must define vars.SITE_URL as the final HTTPS site origin.",
  );
}

function run(command, args, environment = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: environment,
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed (${signal ?? `exit ${code}`}).`,
          ),
        );
      }
    });
  });
}

const openNext = join(
  root,
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "index.js",
);

await run(process.execPath, [join(root, "scripts", "clean-production-build.mjs")]);
await run(process.execPath, [join(root, "scripts", "prepare-ffmpeg-assets.mjs")]);
await run(process.execPath, [openNext, "build"], {
  ...process.env,
  SITE_URL: siteUrl,
});
await run(process.execPath, [join(root, "scripts", "validate-production-build.mjs")]);
