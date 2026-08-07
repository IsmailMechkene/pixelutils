"use client";

import { useState } from "react";

import { recordToolHistory } from "@/lib/storage/tool-activity";

import { ActionButton } from "./action-button";
import { ClearButton } from "./clear-button";
import { CopyButton } from "./copy-button";
import { DownloadButton } from "./download-button";
import { SampleButton } from "./sample-button";
import { TextInputPanel } from "./text-input-panel";
import { TextOutputPanel } from "./text-output-panel";
import { ToolActions } from "./tool-actions";

type TransformResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

interface TextTransformWorkspaceProps {
  slug: string;
  actionLabel: string;
  sample: string;
  filename: string;
  inputLabel: string;
  inputDescription: string;
  outputLabel: string;
  outputDescription: string;
  placeholder: string;
  transform: (input: string) => TransformResult | Promise<TransformResult>;
  mimeType?: string;
  processingLabel?: string;
}

export function TextTransformWorkspace({
  slug,
  actionLabel,
  sample,
  filename,
  inputLabel,
  inputDescription,
  outputLabel,
  outputDescription,
  placeholder,
  transform,
  mimeType,
  processingLabel = "Processing…",
}: TextTransformWorkspaceProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function run() {
    setProcessing(true);
    setError("");
    setOutput("");
    try {
      const result = await transform(input);
      if (!result.ok) {
        setError(result.error);
        setOutput("");
        return;
      }
      setError("");
      setOutput(result.value);
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The input could not be processed.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
    recordToolHistory(slug, "cleared", { sensitive: false });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void run();
      }}
    >
      <ToolActions>
        <ActionButton
          disabled={processing}
          icon="refresh"
          tone="primary"
          type="submit"
        >
          {processing ? processingLabel : actionLabel}
        </ActionButton>
        <SampleButton
          disabled={processing}
          onSample={() => {
            setInput(sample);
            setOutput("");
            setError("");
            recordToolHistory(slug, "sampled", { sensitive: false });
          }}
        />
        <ClearButton
          disabled={processing || (!input && !output)}
          onClear={clear}
        />
      </ToolActions>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TextInputPanel
          description={inputDescription}
          error={error}
          disabled={processing}
          id={`${slug}-input`}
          label={inputLabel}
          onChange={(value) => {
            setInput(value);
            if (error) setError("");
          }}
          placeholder={placeholder}
          value={input}
        />
        <TextOutputPanel
          actions={
            <ToolActions label="Output actions">
              <CopyButton
                onCopied={() =>
                  recordToolHistory(slug, "copied", { sensitive: false })
                }
                onError={setError}
                value={output}
              />
              <DownloadButton
                data={output}
                filename={filename}
                mimeType={mimeType}
                onDownloaded={() =>
                  recordToolHistory(slug, "downloaded", { sensitive: false })
                }
              />
            </ToolActions>
          }
          description={outputDescription}
          id={`${slug}-output`}
          label={outputLabel}
          value={output}
        />
      </div>
    </form>
  );
}
