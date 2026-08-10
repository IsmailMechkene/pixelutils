import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const targetDirectory = join(root, "public", "wasm", "media", "ffmpeg", "0.12.10");
const sourceDirectory = join(root, "node_modules", "@ffmpeg", "core", "dist", "esm");
const wrapperSourceDirectory = join(root, "node_modules", "@ffmpeg", "ffmpeg", "dist", "esm");

await rm(targetDirectory, { force: true, recursive: true });
await mkdir(targetDirectory, { recursive: true });
await Promise.all([
  cp(join(sourceDirectory, "ffmpeg-core.js"), join(targetDirectory, "ffmpeg-core.js")),
  cp(join(sourceDirectory, "ffmpeg-core.wasm"), join(targetDirectory, "ffmpeg-core.wasm")),
  cp(wrapperSourceDirectory, join(targetDirectory, "wrapper"), { recursive: true }),
]);
