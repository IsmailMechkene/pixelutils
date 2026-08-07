"use client";

import { useState } from "react";

import { recordToolHistory } from "@/lib/storage/tool-activity";

import { ActionButton } from "./action-button";
import { ClearButton } from "./clear-button";
import { CopyButton } from "./copy-button";
import { DownloadButton } from "./download-button";
import { SampleButton } from "./sample-button";
import { SwapButton } from "./swap-button";
import { TextInputPanel } from "./text-input-panel";
import { TextOutputPanel } from "./text-output-panel";
import { ToolActions } from "./tool-actions";

type Direction = "encode" | "decode";
type Result =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

interface BidirectionalTextWorkspaceProps {
  slug: string;
  encode: (value: string) => Result;
  decode: (value: string) => Result;
  encodeSample: string;
  decodeSample: string;
  encodeInputLabel: string;
  decodeInputLabel: string;
  encodeOutputLabel: string;
  decodeOutputLabel: string;
  description: string;
  filename: string;
}

export function BidirectionalTextWorkspace(
  props: BidirectionalTextWorkspaceProps,
) {
  const [direction, setDirection] = useState<Direction>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const sensitive = false;

  function process() {
    const result =
      direction === "encode" ? props.encode(input) : props.decode(input);
    if (!result.ok) {
      setError(result.error);
      setOutput("");
      return;
    }
    setError("");
    setOutput(result.value);
    recordToolHistory(props.slug, "processed", { sensitive });
  }

  function swap() {
    setDirection((value) => (value === "encode" ? "decode" : "encode"));
    setInput(output || input);
    setOutput("");
    setError("");
    recordToolHistory(props.slug, "swapped", { sensitive });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        process();
      }}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Operation</legend>
        <div className="mt-2 inline-flex flex-wrap gap-1 rounded-control bg-panel-muted p-1">
          {(["encode", "decode"] as const).map((value) => (
            <label
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg px-4 text-sm font-medium transition-colors focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-accent ${
                direction === value
                  ? "bg-panel text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
              key={value}
            >
              <input
                checked={direction === value}
                className="sr-only"
                name={`${props.slug}-direction`}
                onChange={() => {
                  setDirection(value);
                  setOutput("");
                  setError("");
                }}
                type="radio"
                value={value}
              />
              {value === "encode" ? "Encode" : "Decode"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 border-t border-line pt-4">
        <ToolActions label="Transform actions">
          <ActionButton icon="refresh-cw" tone="primary" type="submit">
            {direction === "encode" ? "Encode" : "Decode"}
          </ActionButton>
          <SwapButton
            disabled={!input && !output}
            onSwap={swap}
            label="Swap direction"
          />
          <SampleButton
            onSample={() => {
              setInput(
                direction === "encode"
                  ? props.encodeSample
                  : props.decodeSample,
              );
              setOutput("");
              setError("");
              recordToolHistory(props.slug, "sampled", { sensitive });
            }}
          />
          <ClearButton
            disabled={!input && !output}
            onClear={() => {
              setInput("");
              setOutput("");
              setError("");
              recordToolHistory(props.slug, "cleared", { sensitive });
            }}
          />
        </ToolActions>
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <TextInputPanel
          description={props.description}
          error={error}
          id={`${props.slug}-input`}
          label={
            direction === "encode"
              ? props.encodeInputLabel
              : props.decodeInputLabel
          }
          onChange={(value) => {
            setInput(value);
            if (error) setError("");
          }}
          value={input}
        />
        <TextOutputPanel
          actions={
            <ToolActions label="Output actions">
              <CopyButton
                value={output}
                onError={setError}
                onCopied={() =>
                  recordToolHistory(props.slug, "copied", { sensitive })
                }
              />
              <DownloadButton
                data={output}
                filename={props.filename}
                onDownloaded={() =>
                  recordToolHistory(props.slug, "downloaded", { sensitive })
                }
              />
            </ToolActions>
          }
          id={`${props.slug}-output`}
          label={
            direction === "encode"
              ? props.encodeOutputLabel
              : props.decodeOutputLabel
          }
          value={output}
        />
      </div>
    </form>
  );
}
