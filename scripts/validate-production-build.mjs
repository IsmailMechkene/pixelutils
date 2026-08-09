import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const outputRoot = join(process.cwd(), ".open-next");
const nextRoot = join(process.cwd(), ".next");
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

  const [nextBuildId, openNextBuildId, prerenderManifest] = await Promise.all([
    readFile(join(nextRoot, "BUILD_ID"), "utf8"),
    readFile(join(assetsPath, "BUILD_ID"), "utf8"),
    readFile(join(nextRoot, "prerender-manifest.json"), "utf8").then(JSON.parse),
  ]);
  const buildId = nextBuildId.trim();
  if (!buildId || buildId !== openNextBuildId.trim()) {
    throw new Error(
      "OpenNext assets do not match the current Next.js production build.",
    );
  }

  const indexableContentRoutes = Object.keys(prerenderManifest.routes).filter(
    (route) =>
      route.startsWith("/tools/") ||
      route.startsWith("/categories/") ||
      route === "/guides" ||
      route.startsWith("/guides/"),
  );
  if (indexableContentRoutes.length === 0) {
    throw new Error(
      "Next.js production build did not prerender indexable content routes.",
    );
  }

  await Promise.all(
    indexableContentRoutes.map(async (route) => {
      const cachePath = join(
        outputRoot,
        "cache",
        buildId,
        `${route.slice(1)}.cache`,
      );
      try {
        await access(cachePath);
      } catch {
        throw new Error(
          `OpenNext cache is missing the current prerendered route: ${route}`,
        );
      }
    }),
  );

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
    `Validated Cloudflare output: ${indexableContentRoutes.length} current indexable content routes, ${assetFiles.length} static assets and ${
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
