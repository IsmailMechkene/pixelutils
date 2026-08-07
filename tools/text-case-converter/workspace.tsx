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
import { CustomSelect } from "@/components/ui/custom-select";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { convertTextCase, type CaseMode } from "./logic";

const labels: Record<CaseMode, string> = {
  uppercase: "UPPERCASE",
  lowercase: "lowercase",
  title: "Title Case",
  sentence: "Sentence case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
};
const caseOptions = Object.entries(labels).map(([value, label]) => ({
  value: value as CaseMode,
  label,
}));
const sample = "pixelUtils makes TEXT transformations quick and private.";

export default function TextCaseConverterWorkspace({ slug }: { slug: string }) {
  const [mode, setMode] = useState<CaseMode>("title");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function convert() {
    setOutput(convertTextCase(input, mode));
    recordToolHistory(slug, "processed", { sensitive: false });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        convert();
      }}
    >
      <CustomSelect
        className="sm:max-w-xs"
        id="case-mode"
        label="Output case"
        onChange={(value) => {
          setMode(value);
          setOutput("");
        }}
        options={caseOptions}
        value={mode}
      />
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions label="Conversion actions">
          <ActionButton
            disabled={!input}
            icon="refresh"
            tone="primary"
            type="submit"
          >
            Convert case
          </ActionButton>
          <SampleButton
            onSample={() => {
              setInput(sample);
              setOutput("");
              recordToolHistory(slug, "sampled", { sensitive: false });
            }}
          />
          <ClearButton
            disabled={!input && !output}
            onClear={() => {
              setInput("");
              setOutput("");
              recordToolHistory(slug, "cleared", { sensitive: false });
            }}
          />
        </ToolActions>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TextInputPanel
          id="case-input"
          label="Text input"
          monospace={false}
          onChange={setInput}
          placeholder="Paste text to convert…"
          value={input}
        />
        <TextOutputPanel
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
                filename="converted-text.txt"
                onDownloaded={() =>
                  recordToolHistory(slug, "downloaded", { sensitive: false })
                }
              />
            </ToolActions>
          }
          id="case-output"
          label={labels[mode]}
          monospace={false}
          value={output}
        />
      </div>
    </form>
  );
}
