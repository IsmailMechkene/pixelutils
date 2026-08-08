import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const outputRoot = join(process.cwd(), ".open-next");
const workerPath = join(outputRoot, "worker.js");
const assetsPath = join(outputRoot, "assets");

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else {
      files.push(path);
    }
  }

  return files;
}

try {
  const worker = await stat(workerPath);
  if (!worker.isFile()) throw new Error("Cloudflare worker output is missing.");

  const assetFiles = await collectFiles(assetsPath);
  if (assetFiles.length === 0) {
    throw new Error("Cloudflare static asset output is empty.");
  }

  const publicSourceMaps = assetFiles.filter((path) => path.endsWith(".map"));
  const sourceMapsEnabled = process.env.ENABLE_BROWSER_SOURCE_MAPS === "true";
  if (publicSourceMaps.length > 0 && !sourceMapsEnabled) {
    throw new Error(
      `Public browser source maps found:\n${publicSourceMaps
        .map((path) => relative(process.cwd(), path))
        .join("\n")}`,
    );
  }

  const clientJavaScript = assetFiles.filter((path) => path.endsWith(".js"));
  const serverOnlyEnvironmentNames = [
    "SITE_URL",
    "CONTACT_EMAIL",
    "ADS_ENABLED",
    "ADS_PROVIDER",
    "AD_SLOT_",
    "ENABLE_BROWSER_SOURCE_MAPS",
  ];

  for (const path of clientJavaScript) {
    const source = await readFile(path, "utf8");
    const exposedName = serverOnlyEnvironmentNames.find((name) =>
      source.includes(name),
    );
    if (exposedName) {
      throw new Error(
        `Server-only environment reference ${exposedName} found in ${relative(
          process.cwd(),
          path,
        )}.`,
      );
    }
  }

  console.log(
    `Validated Cloudflare output: ${assetFiles.length} static assets and ${
      publicSourceMaps.length === 0
        ? "no public source maps"
        : `${publicSourceMaps.length} deliberately enabled public source maps`
    }; server-only environment references are absent from client chunks.`,
  );
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : "Production output validation failed.",
  );
  process.exitCode = 1;
}
