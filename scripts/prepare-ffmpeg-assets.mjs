import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const targetDirectory = join(root, "public", "wasm", "media", "ffmpeg", "0.12.10");
const sourceDirectory = join(root, "node_modules", "@ffmpeg", "core", "dist", "esm");
const wrapperSourceDirectory = join(root, "node_modules", "@ffmpeg", "ffmpeg", "dist", "esm");
const wasmChunkSize = 8 * 1024 * 1024;

await rm(targetDirectory, { force: true, recursive: true });
await mkdir(targetDirectory, { recursive: true });
const wasm = await readFile(join(sourceDirectory, "ffmpeg-core.wasm"));
const wasmChunkCount = Math.ceil(wasm.byteLength / wasmChunkSize);

await Promise.all([
  cp(join(sourceDirectory, "ffmpeg-core.js"), join(targetDirectory, "ffmpeg-core.js")),
  cp(wrapperSourceDirectory, join(targetDirectory, "wrapper"), { recursive: true }),
  writeFile(
    join(targetDirectory, "ffmpeg-core.manifest.json"),
    `${JSON.stringify({ byteLength: wasm.byteLength, parts: wasmChunkCount })}\n`,
  ),
  ...Array.from({ length: wasmChunkCount }, (_, index) =>
    writeFile(
      join(targetDirectory, `ffmpeg-core.wasm.${index}`),
      wasm.subarray(index * wasmChunkSize, (index + 1) * wasmChunkSize),
    ),
  ),
]);
