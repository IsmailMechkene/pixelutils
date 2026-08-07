"use client";

import { TextTransformWorkspace } from "@/components/tool-shell/text-transform-workspace";

import { minifyJson } from "./logic";

const sample = `{
  "event": "page_view",
  "properties": {
    "anonymous": true,
    "count": 3
  }
}`;

export default function JsonMinifierWorkspace({ slug }: { slug: string }) {
  return (
    <TextTransformWorkspace
      actionLabel="Validate and minify"
      filename="minified.json"
      inputDescription="Whitespace inside string values is preserved."
      inputLabel="JSON input"
      mimeType="application/json;charset=utf-8"
      outputDescription="Compact, valid JSON with insignificant whitespace removed."
      outputLabel="Minified JSON"
      placeholder={'{\n  "active": true\n}'}
      sample={sample}
      slug={slug}
      transform={minifyJson}
    />
  );
}
