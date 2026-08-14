import { describe, expect, it } from "vitest";

import { isWasmChunkManifest, joinWasmChunks } from "./wasm-chunks";

describe("FFmpeg WASM chunks", () => {
  it("reassembles ordered chunks after verifying their total byte length", () => {
    expect(
      Array.from(
        joinWasmChunks(
          [new Uint8Array([0, 1]), new Uint8Array([2, 3, 4])],
          5,
        ),
      ),
    ).toEqual([0, 1, 2, 3, 4]);
  });

  it("rejects missing or mismatched chunks", () => {
    expect(() => joinWasmChunks([new Uint8Array([0])], 2)).toThrow(
      "could not be verified",
    );
    expect(() => joinWasmChunks([], 0)).toThrow("incomplete");
  });

  it("only accepts a bounded manifest", () => {
    expect(isWasmChunkManifest({ byteLength: 10, parts: 2 })).toBe(true);
    expect(isWasmChunkManifest({ byteLength: 10, parts: 17 })).toBe(false);
    expect(isWasmChunkManifest({ byteLength: 0, parts: 1 })).toBe(false);
  });
});
