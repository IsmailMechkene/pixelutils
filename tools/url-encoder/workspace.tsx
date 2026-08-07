"use client";

import { useState } from "react";

import { BidirectionalTextWorkspace } from "@/components/tool-shell/bidirectional-text-workspace";

import { decodeUrl, encodeUrl, type UrlMode } from "./logic";

export default function UrlEncoderWorkspace({ slug }: { slug: string }) {
  const [mode, setMode] = useState<UrlMode>("component");

  return (
    <div>
      <label className="text-sm font-semibold text-ink" htmlFor="url-encoding-scope">
        Encoding scope
      </label>
      <select
        className="mt-2 block min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-sm text-ink outline-none focus:border-accent sm:max-w-xs"
        id="url-encoding-scope"
        onChange={(event) => setMode(event.target.value as UrlMode)}
        value={mode}
      >
        <option value="component">Query value or path segment</option>
        <option value="full-url">Full URL (preserve structure)</option>
      </select>
      <p className="mt-2 text-xs leading-5 text-ink-subtle">
        Component mode escapes separators such as &amp;, =, and /. Full URL mode keeps
        structural URL characters.
      </p>
      <div className="mt-6 border-t border-line pt-6">
        <BidirectionalTextWorkspace
          key={mode}
          decode={(value) => decodeUrl(value, mode)}
          decodeInputLabel="Percent-encoded input"
          decodeOutputLabel="Decoded text"
          decodeSample={
            mode === "component"
              ? "coffee%20%26%20caf%C3%A9"
              : "https://example.com/a%20path?q=hello%20world"
          }
          description={`Using ${mode === "component" ? "component" : "full URL"} rules.`}
          encode={(value) => encodeUrl(value, mode)}
          encodeInputLabel={mode === "component" ? "Text input" : "Full URL input"}
          encodeOutputLabel="Percent-encoded output"
          encodeSample={
            mode === "component"
              ? "coffee & café"
              : "https://example.com/a path?q=hello world"
          }
          filename="url-encoded-result.txt"
          slug={slug}
        />
      </div>
    </div>
  );
}
