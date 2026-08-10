"use client";

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

export async function createFfmpegEngine(): Promise<FfmpegEngine> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const engine = new FFmpeg();
  await engine.load({
    classWorkerURL: new URL(
      `${coreBasePath}/wrapper/worker.js`,
      window.location.origin,
    ).toString(),
    coreURL: `${coreBasePath}/ffmpeg-core.js`,
    wasmURL: `${coreBasePath}/ffmpeg-core.wasm`,
  });
  return engine;
}
