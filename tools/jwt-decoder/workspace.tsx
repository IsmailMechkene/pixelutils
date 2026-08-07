"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  SampleButton,
  TextInputPanel,
  TextOutputPanel,
  ToolActions,
} from "@/components/tool-shell";

import { decodeJwt } from "./logic";

export default function JwtDecoderWorkspace() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signaturePresent, setSignaturePresent] = useState(false);
  const [error, setError] = useState("");

  function decode() {
    const result = decodeJwt(input);
    if (!result.ok) {
      setError(result.error);
      setHeader("");
      setPayload("");
      setSignaturePresent(false);
      return;
    }
    setHeader(result.header);
    setPayload(result.payload);
    setSignaturePresent(Boolean(result.signature));
    setError("");
  }
  function clear() {
    setInput("");
    setHeader("");
    setPayload("");
    setSignaturePresent(false);
    setError("");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        decode();
      }}
    >
      <div className="rounded-card border border-[var(--danger-line)] bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-ink">
        <strong>Decoding does not verify the signature.</strong> Treat every
        claim as untrusted until a trusted system verifies the token.
      </div>
      <div className="mt-5">
        <TextInputPanel
          id="jwt-input"
          label="JWT"
          description="The token stays in memory only. It is not requested, uploaded, logged, or saved to history."
          error={error}
          onChange={(value) => {
            setInput(value);
            setError("");
          }}
          placeholder="eyJhbGciOi…"
          rows={6}
          value={input}
        />
      </div>
      <div className="mt-5">
        <ToolActions>
          <ActionButton
            disabled={!input}
            icon="code"
            tone="primary"
            type="submit"
          >
            Decode JWT
          </ActionButton>
          <SampleButton
            label="Use safe sample"
            onSample={() => {
              setInput(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIn0.not-a-real-signature",
              );
              setHeader("");
              setPayload("");
              setSignaturePresent(false);
              setError("");
            }}
          />
          <ClearButton disabled={!input && !header} onClear={clear} />
        </ToolActions>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TextOutputPanel
          id="jwt-header"
          label="Header"
          value={header}
          actions={<CopyButton label="Copy header" value={header} />}
        />
        <TextOutputPanel
          id="jwt-payload"
          label="Payload"
          value={payload}
          actions={<CopyButton label="Copy payload" value={payload} />}
        />
      </div>
      {signaturePresent ? (
        <p className="mt-4 text-sm text-ink-muted">
          A signature segment is present, but PixelUtils has not verified it.
        </p>
      ) : null}
    </form>
  );
}
