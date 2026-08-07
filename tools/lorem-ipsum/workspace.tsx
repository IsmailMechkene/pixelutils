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
import { CustomSelect } from "@/components/ui/custom-select";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { generateLorem, type LoremUnit } from "./logic";

const unitOptions = [
  { value: "paragraphs", label: "Paragraphs" },
  { value: "sentences", label: "Sentences" },
  { value: "words", label: "Words" },
] as const;

function cryptographicIndex(maximum: number) {
  if (!globalThis.crypto?.getRandomValues)
    throw new Error("Secure browser randomness is unavailable.");
  const limit = Math.floor(0x1_0000_0000 / maximum) * maximum;
  const values = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(values);
  } while ((values[0] ?? 0) >= limit);
  return (values[0] ?? 0) % maximum;
}

export default function LoremIpsumWorkspace({ slug }: { slug: string }) {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function generate() {
    try {
      setOutput(
        generateLorem({ unit, count, startWithLorem }, cryptographicIndex),
      );
      setError("");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (caught) {
      setOutput("");
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }
  const max = unit === "words" ? 500 : unit === "sentences" ? 50 : 20;
  const controlClass =
    "mt-2 min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-sm text-ink outline-none focus:border-accent";
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        generate();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <CustomSelect
          id="lorem-unit"
          label="Generate"
          onChange={(next) => {
            setUnit(next);
            setCount(next === "paragraphs" ? 3 : next === "sentences" ? 5 : 50);
            setOutput("");
          }}
          options={unitOptions}
          value={unit}
        />
        <label className="text-sm font-semibold text-ink">
          Count
          <input
            className={controlClass}
            max={max}
            min={1}
            onChange={(event) => setCount(event.target.valueAsNumber)}
            type="number"
            value={Number.isNaN(count) ? "" : count}
          />
        </label>
      </div>
      <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink">
        <input
          checked={startWithLorem}
          className="size-4 accent-[var(--accent)]"
          onChange={(event) => setStartWithLorem(event.target.checked)}
          type="checkbox"
        />
        Start with “Lorem ipsum dolor sit amet”
      </label>
      {error ? (
        <div className="mt-3">
          <ErrorMessage message={error} />
        </div>
      ) : null}
      <div className="mt-4 border-t border-line pt-4">
        <ToolActions>
          <ActionButton icon="text" tone="primary" type="submit">
            Generate text
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
          id="lorem-output"
          label="Generated placeholder text"
          monospace={false}
          value={output}
          actions={
            <ToolActions label="Output actions">
              <CopyButton
                value={output}
                onCopied={() =>
                  recordToolHistory(slug, "copied", { sensitive: false })
                }
              />
              <DownloadButton
                data={output}
                filename="lorem-ipsum.txt"
                onDownloaded={() =>
                  recordToolHistory(slug, "downloaded", { sensitive: false })
                }
              />
            </ToolActions>
          }
        />
      </div>
    </form>
  );
}
