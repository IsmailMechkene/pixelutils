"use client";

import { BidirectionalTextWorkspace } from "@/components/tool-shell/bidirectional-text-workspace";

import { decodeBase64, encodeBase64 } from "./logic";

export default function Base64Workspace({ slug }: { slug: string }) {
  return (
    <BidirectionalTextWorkspace
      decode={decodeBase64}
      decodeInputLabel="Base64 input"
      decodeOutputLabel="Decoded UTF-8 text"
      decodeSample="UGl4ZWxVdGlscyBrZWVwcyBjYWbDqSDwn5GLIGxvY2FsLg=="
      description="Unicode text is encoded as UTF-8. Decoding expects Base64 that represents valid UTF-8 text."
      encode={encodeBase64}
      encodeInputLabel="Text input"
      encodeOutputLabel="Base64 output"
      encodeSample="PixelUtils keeps café 👋 local."
      filename="base64-result.txt"
      slug={slug}
    />
  );
}
