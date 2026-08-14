"use client";

import {
  isWasmChunkManifest,
  joinWasmChunks,
} from "./wasm-chunks";

const coreBasePath = "/wasm/media/ffmpeg/0.12.10";

export interface FfmpegEngine {
  on: (event: "progress", callback: (event: { progress: number; time: number }) => void) => void;
  off: (event: "progress", callback: (event: { progress: number; time: number }) => void) => void;
  writeFile: (path: string, data: Uint8Array) => Promise<boolean>;
  exec: (args: string[], timeout?: number) => Promise<number>;
  ffprobe: (args: string[], timeout?: number) => Promise<number>;
  readFile: (path: string) => Promise<Uint8Array | string>;
  deleteFile: (path: string) => Promise<boolean>;
  terminate: () => void;
}

async function fetchLocalAsset(path: string): Promise<Response> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("The local FFmpeg runtime could not be loaded.");
  }
  return response;
}

async function createWasmUrl(): Promise<string> {
  const manifestResponse = await fetchLocalAsset(
    `${coreBasePath}/ffmpeg-core.manifest.json`,
  );
  const manifest: unknown = await manifestResponse.json();
  if (!isWasmChunkManifest(manifest)) {
    throw new Error("The local FFmpeg runtime manifest is invalid.");
  }

  const chunks = await Promise.all(
    Array.from({ length: manifest.parts }, async (_, index) => {
      const response = await fetchLocalAsset(
        `${coreBasePath}/ffmpeg-core.wasm.${index}`,
      );
      return new Uint8Array(await response.arrayBuffer());
    }),
  );
  return URL.createObjectURL(
    new Blob([joinWasmChunks(chunks, manifest.byteLength)], {
      type: "application/wasm",
    }),
  );
}

export async function createFfmpegEngine(): Promise<FfmpegEngine> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const engine = new FFmpeg();
  const wasmUrl = await createWasmUrl();
  try {
    await engine.load({
      classWorkerURL: new URL(
        `${coreBasePath}/wrapper/worker.js`,
        window.location.origin,
      ).toString(),
      coreURL: `${coreBasePath}/ffmpeg-core.js`,
      wasmURL: wasmUrl,
    });
  } finally {
    URL.revokeObjectURL(wasmUrl);
  }
  return engine;
}
