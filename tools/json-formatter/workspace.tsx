"use client";

import { TextTransformWorkspace } from "@/components/tool-shell/text-transform-workspace";

import { formatJson } from "./logic";

const sample = `{
  "project": "PixelUtils",
  "private": true,
  "features": ["fast", "accessible", "local"]
}`;

export default function JsonFormatterWorkspace({ slug }: { slug: string }) {
  return (
    <TextTransformWorkspace
      actionLabel="Format and validate"
      filename="formatted.json"
      inputDescription="Paste any JSON value. Validation runs when you format it."
      inputLabel="JSON input"
      mimeType="application/json;charset=utf-8"
      outputDescription="Valid JSON formatted with two-space indentation."
      outputLabel="Formatted JSON"
      placeholder='{"message":"Hello"}'
      sample={sample}
      slug={slug}
      transform={formatJson}
    />
  );
}
