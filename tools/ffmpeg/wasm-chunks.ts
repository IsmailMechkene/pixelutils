export interface WasmChunkManifest {
  readonly byteLength: number;
  readonly parts: number;
}

const maximumWasmChunkParts = 16;

export function isWasmChunkManifest(value: unknown): value is WasmChunkManifest {
  if (!value || typeof value !== "object") return false;

  const manifest = value as Record<string, unknown>;
  return (
    typeof manifest.byteLength === "number" &&
    Number.isSafeInteger(manifest.byteLength) &&
    manifest.byteLength > 0 &&
    typeof manifest.parts === "number" &&
    Number.isSafeInteger(manifest.parts) &&
    manifest.parts > 0 &&
    manifest.parts <= maximumWasmChunkParts
  );
}

export function joinWasmChunks(
  chunks: readonly Uint8Array[],
  expectedByteLength: number,
): Uint8Array<ArrayBuffer> {
  if (
    !Number.isSafeInteger(expectedByteLength) ||
    expectedByteLength <= 0 ||
    chunks.length === 0 ||
    chunks.some((chunk) => chunk.byteLength === 0)
  ) {
    throw new Error("The local FFmpeg runtime is incomplete.");
  }

  const byteLength = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  if (byteLength !== expectedByteLength) {
    throw new Error("The local FFmpeg runtime could not be verified.");
  }

  const wasm = new Uint8Array(new ArrayBuffer(byteLength));
  let offset = 0;
  for (const chunk of chunks) {
    wasm.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return wasm;
}
