"use client";

import { BidirectionalTextWorkspace } from "@/components/tool-shell";

import { escapeHtml, unescapeHtml } from "./logic";

export default function HtmlEscapeWorkspace({ slug }: { slug: string }) {
  return <BidirectionalTextWorkspace slug={slug} encode={escapeHtml} decode={unescapeHtml} encodeSample={'<article aria-label="News & updates">Café © 2026</article>'} decodeSample="&lt;strong&gt;Tom &amp; Jerry&#39;s&lt;/strong&gt;" encodeInputLabel="Text or HTML" decodeInputLabel="HTML entities" encodeOutputLabel="Escaped HTML" decodeOutputLabel="Unescaped text" description="Output is displayed as text and is never executed as markup." filename="html-entities.txt" />;
}
