"use client";

import { TextTransformWorkspace } from "@/components/tool-shell";

import { formatHtml } from "./logic";

const sample = '<main><article><h1>Browser tools</h1><p>Fast <strong>and private</strong>.</p></article></main>';

export default function HtmlFormatterWorkspace({ slug }: { slug: string }) {
  return <TextTransformWorkspace slug={slug} actionLabel="Format HTML" processingLabel="Loading formatter…" sample={sample} filename="formatted.html" mimeType="text/html;charset=utf-8" inputLabel="HTML input" inputDescription="Prettier’s HTML parser loads only when you format." outputLabel="Formatted HTML" outputDescription="Two-space indentation with meaningful inline whitespace preserved." placeholder="<main><h1>Hello</h1></main>" transform={formatHtml} />;
}
