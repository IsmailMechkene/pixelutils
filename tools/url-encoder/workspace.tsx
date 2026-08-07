"use client";

import { useState } from "react";

import { BidirectionalTextWorkspace } from "@/components/tool-shell/bidirectional-text-workspace";
import { CustomSelect } from "@/components/ui/custom-select";

import { decodeUrl, encodeUrl, type UrlMode } from "./logic";

const scopeOptions = [
  { value: "component", label: "Query value or path segment" },
  { value: "full-url", label: "Full URL (preserve structure)" },
] as const;

export default function UrlEncoderWorkspace({ slug }: { slug: string }) {
  const [mode, setMode] = useState<UrlMode>("component");

  return (
    <div>
      <CustomSelect
        className="sm:max-w-xs"
        description="Component mode escapes separators such as &, =, and /. Full URL mode keeps structural URL characters."
        id="url-encoding-scope"
        label="Encoding scope"
        onChange={setMode}
        options={scopeOptions}
        value={mode}
      />
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
          encodeInputLabel={
            mode === "component" ? "Text input" : "Full URL input"
          }
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
