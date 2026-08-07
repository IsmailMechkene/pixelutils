"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  DownloadButton,
  SampleButton,
  TextInputPanel,
  TextOutputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { convertColor, getAccessibleTextColor } from "./logic";

export default function ColorConverterWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  function convert() {
    const result = convertColor(input);
    if (!result.ok) {
      setError(result.error);
      setOutput("");
      setPreview("");
      return;
    }
    const value = `HEX: ${result.hex}\nRGB: ${result.rgb}\nHSL: ${result.hsl}`;
    setOutput(value);
    setPreview(result.rgb);
    setError("");
    recordToolHistory(slug, "processed", { sensitive: false });
  }

  const previewResult = preview ? convertColor(preview) : undefined;
  const previewTextColor = previewResult?.ok
    ? getAccessibleTextColor(previewResult.color)
    : "var(--ink-muted)";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        convert();
      }}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <TextInputPanel
            id="color-input"
            label="Color value"
            description="Supports #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb()/rgba(), and hsl()/hsla()."
            error={error}
            onChange={(value) => {
              setInput(value);
              setError("");
            }}
            placeholder="#6366F1"
            rows={5}
            value={input}
          />
          <div className="mt-4">
            <ToolActions>
              <ActionButton
                disabled={!input}
                icon="refresh"
                tone="primary"
                type="submit"
              >
                Convert color
              </ActionButton>
              <SampleButton
                onSample={() => {
                  setInput("hsl(245, 80%, 67%)");
                  setOutput("");
                  setPreview("");
                  recordToolHistory(slug, "sampled", { sensitive: false });
                }}
              />
              <ClearButton
                disabled={!input && !output}
                onClear={() => {
                  setInput("");
                  setOutput("");
                  setPreview("");
                  setError("");
                  recordToolHistory(slug, "cleared", { sensitive: false });
                }}
              />
            </ToolActions>
          </div>
        </div>
        <div>
          <TextOutputPanel
            id="color-output"
            label="Converted values"
            description="Alpha is included only when it is below 1."
            value={output}
            actions={
              <ToolActions label="Output actions">
                <CopyButton
                  value={output}
                  onError={setError}
                  onCopied={() =>
                    recordToolHistory(slug, "copied", { sensitive: false })
                  }
                />
                <DownloadButton
                  data={output}
                  filename="color-values.txt"
                  onDownloaded={() =>
                    recordToolHistory(slug, "downloaded", { sensitive: false })
                  }
                />
              </ToolActions>
            }
          />
          <div
            className="mt-4 flex min-h-24 items-center justify-center rounded-card border border-line-strong p-4 text-sm font-semibold"
            style={{
              backgroundColor: preview || "var(--panel-muted)",
              color: previewTextColor,
            }}
          >
            {preview ? "Color preview" : "Preview"}
          </div>
        </div>
      </div>
    </form>
  );
}
