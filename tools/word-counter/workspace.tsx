"use client";

import { useMemo, useState } from "react";

import {
  ClearButton,
  CopyButton,
  DownloadButton,
  SampleButton,
  TextInputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { countText } from "./logic";

const sample =
  "Clear writing starts with useful feedback. PixelUtils counts words, characters, lines, and sentences as you type.";

export default function WordCounterWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const counts = useMemo(() => countText(input), [input]);
  const summary = `Words: ${counts.words}\nCharacters: ${counts.characters}\nCharacters without whitespace: ${counts.charactersWithoutWhitespace}\nLines: ${counts.lines}\nSentences: ${counts.sentences}`;
  const metrics = [
    ["Words", counts.words],
    ["Characters", counts.characters],
    ["Without whitespace", counts.charactersWithoutWhitespace],
    ["Lines", counts.lines],
    ["Sentences", counts.sentences],
  ] as const;

  return (
    <div>
      <TextInputPanel
        description="Counts update locally as you type. Emoji count as Unicode characters, not words."
        id="word-counter-input"
        label="Text to count"
        monospace={false}
        onChange={setInput}
        placeholder="Start typing or paste text…"
        rows={10}
        value={input}
      />
      <div className="mt-3 border-t border-line pt-3">
        <ToolActions label="Input actions">
          <SampleButton
            onSample={() => {
              setInput(sample);
              recordToolHistory(slug, "sampled", { sensitive: false });
            }}
          />
          <ClearButton
            disabled={!input}
            onClear={() => {
              setInput("");
              recordToolHistory(slug, "cleared", { sensitive: false });
            }}
          />
        </ToolActions>
      </div>
      <section aria-labelledby="count-results-title" className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3
            className="text-sm font-semibold text-ink"
            id="count-results-title"
          >
            Text counts
          </h3>
          <ToolActions label="Count export actions">
            <CopyButton
              label="Copy counts"
              value={input ? summary : ""}
              onCopied={() =>
                recordToolHistory(slug, "copied", { sensitive: false })
              }
            />
            <DownloadButton
              data={input ? summary : ""}
              filename="text-counts.txt"
              onDownloaded={() =>
                recordToolHistory(slug, "downloaded", { sensitive: false })
              }
            />
          </ToolActions>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map(([label, value]) => (
            <div
              className="rounded-card border border-line bg-canvas p-4"
              key={label}
            >
              <div className="text-2xl font-semibold tabular-nums text-ink">
                {value.toLocaleString()}
              </div>
              <div className="mt-1 text-xs leading-5 text-ink-subtle">
                {label}
              </div>
            </div>
          ))}
        </div>
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {input
            ? `${counts.words} words, ${counts.characters} characters, ${counts.lines} lines, and ${counts.sentences} sentences.`
            : ""}
        </p>
      </section>
    </div>
  );
}
