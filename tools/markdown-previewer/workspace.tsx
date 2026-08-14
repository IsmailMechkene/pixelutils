"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  DownloadButton,
  SampleButton,
  TextInputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { renderMarkdown } from "./logic";

const sample = `# Release notes

PixelUtils keeps your content **in the browser**.

- Fast previews
- Sanitized HTML
- No account

Read the [privacy page](/privacy).`;

export default function MarkdownPreviewerWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function preview() {
    setLoading(true);
    setError("");
    setHtml("");
    try {
      const result = await renderMarkdown(input);
      if (!result.ok) {
        setError(result.error);
        setHtml("");
        return;
      }
      setError("");
      setHtml(result.value);
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The Markdown could not be rendered.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void preview();
      }}
    >
      <TextInputPanel
        id="markdown-input"
        label="Markdown input"
        description="Raw HTML is sanitized; scripts, event handlers, remote images, and unsafe links are removed."
        disabled={loading}
        error={error}
        onChange={(value) => {
          setInput(value);
          setError("");
        }}
        placeholder="# Heading"
        value={input}
      />
      <div className="mt-5 border-y border-line py-4">
        <ToolActions>
          <ActionButton
            disabled={loading}
            icon="refresh-cw"
            tone="primary"
            type="submit"
          >
            {loading ? "Rendering…" : "Preview Markdown"}
          </ActionButton>
          <SampleButton
            disabled={loading}
            onSample={() => {
              setInput(sample);
              setHtml("");
              setError("");
              recordToolHistory(slug, "sampled", { sensitive: false });
            }}
          />
          <ClearButton
            disabled={loading || (!input && !html)}
            onClear={() => {
              setInput("");
              setHtml("");
              setError("");
              recordToolHistory(slug, "cleared", { sensitive: false });
            }}
          />
        </ToolActions>
      </div>
      <div className="mt-6">
        <section aria-labelledby="markdown-preview-label" className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3
                className="text-sm font-semibold text-ink"
                id="markdown-preview-label"
              >
                Sanitized preview
              </h3>
              <p
                className="mt-1 text-xs leading-5 text-ink-subtle"
                id="markdown-preview-description"
              >
                Rendered HTML cannot execute scripts.
              </p>
            </div>
            <ToolActions label="Preview actions">
              <CopyButton
                label="Copy HTML"
                value={html}
                onCopied={() =>
                  recordToolHistory(slug, "copied", { sensitive: false })
                }
              />
              <DownloadButton
                data={html}
                filename="markdown-preview.html"
                mimeType="text/html;charset=utf-8"
                onDownloaded={() =>
                  recordToolHistory(slug, "downloaded", { sensitive: false })
                }
              />
            </ToolActions>
          </div>
          <div
            aria-describedby="markdown-preview-description"
            aria-labelledby="markdown-preview-label"
            className="markdown-preview mt-3 min-h-72 overflow-auto rounded-card border border-line-strong bg-canvas px-5 py-4 text-sm leading-7 text-ink"
            id="markdown-preview"
            role="region"
          >
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-ink-subtle">
                Your sanitized preview will appear here.
              </p>
            )}
          </div>
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {html ? "Sanitized Markdown preview updated." : ""}
          </p>
        </section>
      </div>
    </form>
  );
}
