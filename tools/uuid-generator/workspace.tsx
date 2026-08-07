"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  DownloadButton,
  ErrorMessage,
  TextOutputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { generateUuids } from "./logic";

function cryptographicBytes(length: number) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random generation is unavailable in this browser.");
  }
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}

export default function UuidGeneratorWorkspace({ slug }: { slug: string }) {
  const [quantity, setQuantity] = useState(5);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function generate() {
    try {
      setOutput(generateUuids(quantity, cryptographicBytes).join("\n"));
      setError("");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (caught) {
      setOutput("");
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        generate();
      }}
    >
      <label className="text-sm font-semibold text-ink" htmlFor="uuid-quantity">
        Number of UUIDs
      </label>
      <input
        aria-describedby={error ? "uuid-error" : "uuid-quantity-help"}
        aria-invalid={Boolean(error)}
        className="mt-2 block min-h-11 w-full rounded-control border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-accent sm:max-w-48"
        id="uuid-quantity"
        max={100}
        min={1}
        onChange={(event) => {
          setQuantity(event.target.valueAsNumber);
          setError("");
        }}
        type="number"
        value={Number.isNaN(quantity) ? "" : quantity}
      />
      <p className="mt-2 text-xs text-ink-subtle" id="uuid-quantity-help">
        Generate 1 to 100 cryptographically random UUID version 4 values.
      </p>
      {error ? (
        <div className="mt-3">
          <ErrorMessage id="uuid-error" message={error} />
        </div>
      ) : null}
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions label="Generator actions">
          <ActionButton icon="fingerprint" tone="primary" type="submit">
            Generate UUIDs
          </ActionButton>
          <ClearButton
            disabled={!output}
            onClear={() => {
              setOutput("");
              setError("");
              recordToolHistory(slug, "cleared", { sensitive: false });
            }}
          />
        </ToolActions>
      </div>
      <div className="mt-6">
        <TextOutputPanel
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
                filename="uuids.txt"
                onDownloaded={() =>
                  recordToolHistory(slug, "downloaded", { sensitive: false })
                }
              />
            </ToolActions>
          }
          description="Lowercase RFC 4122 UUID v4 values, one per line."
          id="uuid-output"
          label="Generated UUIDs"
          value={output}
        />
      </div>
    </form>
  );
}
