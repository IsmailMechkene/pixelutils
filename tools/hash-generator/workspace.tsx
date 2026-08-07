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

import {
  generateHash,
  hashAlgorithms,
  type HashAlgorithm,
  type HashEncoding,
} from "./logic";

const algorithmOptions = hashAlgorithms.map((value) => ({
  value,
  label: value === "SHA-1" ? "SHA-1 (legacy)" : value,
}));
const encodingOptions = [
  { value: "hex", label: "Hexadecimal" },
  { value: "base64", label: "Base64" },
] as const;

export default function HashGeneratorWorkspace() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [encoding, setEncoding] = useState<HashEncoding>("hex");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function hash() {
    setLoading(true);
    setError("");
    setOutput("");
    try {
      if (!globalThis.crypto?.subtle)
        throw new Error(
          "SubtleCrypto is unavailable in this browser or insecure context.",
        );
      const bytes = new TextEncoder().encode(input);
      const value = await generateHash(
        bytes,
        algorithm,
        encoding,
        (name, data) =>
          globalThis.crypto.subtle.digest(name, data as BufferSource),
      );
      setOutput(value);
      setError("");
    } catch (caught) {
      setOutput("");
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void hash();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CustomSelect
          disabled={loading}
          id="hash-algorithm"
          label="Algorithm"
          onChange={(value) => {
            setAlgorithm(value);
            setOutput("");
          }}
          options={algorithmOptions}
          value={algorithm}
        />
        <CustomSelect
          disabled={loading}
          id="hash-encoding"
          label="Output encoding"
          onChange={(value) => {
            setEncoding(value);
            setOutput("");
          }}
          options={encodingOptions}
          value={encoding}
        />
      </div>
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions>
          <ActionButton
            disabled={loading}
            icon="shield"
            tone="primary"
            type="submit"
          >
            {loading ? "Hashing…" : "Generate hash"}
          </ActionButton>
          <SampleButton
            disabled={loading}
            onSample={() => {
              setInput("PixelUtils keeps hashing local.");
              setOutput("");
            }}
          />
          <ClearButton
            disabled={loading || (!input && !output)}
            onClear={() => {
              setInput("");
              setOutput("");
              setError("");
            }}
          />
        </ToolActions>
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <TextInputPanel
          id="hash-input"
          label="Text to hash"
          description="Text is encoded as UTF-8 and never stored in tool history."
          disabled={loading}
          error={error}
          onChange={(value) => {
            setInput(value);
            setError("");
          }}
          value={input}
        />
        <TextOutputPanel
          id="hash-output"
          label={`${algorithm} digest`}
          description="Hashes are one-way fingerprints and normally cannot be reversed."
          value={output}
          actions={
            <ToolActions label="Hash output actions">
              <CopyButton value={output} onError={setError} />
              <DownloadButton
                data={output}
                filename={`${algorithm.toLowerCase()}-hash.txt`}
              />
            </ToolActions>
          }
        />
      </div>
    </form>
  );
}
