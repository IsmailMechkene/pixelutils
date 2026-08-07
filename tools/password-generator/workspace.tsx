"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  ErrorMessage,
  TextOutputPanel,
  ToolActions,
} from "@/components/tool-shell";

import { generatePassword, type PasswordOptions } from "./logic";

function cryptographicBytes(length: number) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random generation is unavailable in this browser.");
  }
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}

const initialOptions: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true,
};

export default function PasswordGeneratorWorkspace() {
  const [options, setOptions] = useState<PasswordOptions>(initialOptions);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof PasswordOptions>(
    key: K,
    value: PasswordOptions[K],
  ) {
    setOptions((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function generate() {
    try {
      setOutput(generatePassword(options, cryptographicBytes));
      setError("");
    } catch (caught) {
      setOutput("");
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  const optionLabels: ReadonlyArray<
    [
      keyof Pick<
        PasswordOptions,
        "uppercase" | "lowercase" | "numbers" | "symbols" | "excludeAmbiguous"
      >,
      string,
    ]
  > = [
    ["uppercase", "Uppercase letters (A–Z)"],
    ["lowercase", "Lowercase letters (a–z)"],
    ["numbers", "Numbers (0–9)"],
    ["symbols", "Symbols (!@#$…)"],
    ["excludeAmbiguous", "Exclude ambiguous characters (I, l, 1, O, 0, o)"],
  ];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        generate();
      }}
    >
      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <div>
          <label
            className="text-sm font-semibold text-ink"
            htmlFor="password-length"
          >
            Password length
          </label>
          <input
            aria-describedby="password-length-help"
            className="mt-2 min-h-11 w-full rounded-control border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-accent"
            id="password-length"
            max={128}
            min={8}
            onChange={(event) => update("length", event.target.valueAsNumber)}
            type="number"
            value={Number.isNaN(options.length) ? "" : options.length}
          />
          <p className="mt-2 text-xs text-ink-subtle" id="password-length-help">
            Choose 8 to 128 characters.
          </p>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            Character options
          </legend>
          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {optionLabels.map(([key, label]) => (
              <label
                className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"
                key={key}
              >
                <input
                  checked={options[key]}
                  className="size-4 accent-[var(--accent)]"
                  onChange={(event) => update(key, event.target.checked)}
                  type="checkbox"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      {error ? (
        <div className="mt-4">
          <ErrorMessage id="password-error" message={error} />
        </div>
      ) : null}
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions label="Password actions">
          <ActionButton icon="key-round" tone="primary" type="submit">
            Generate password
          </ActionButton>
          <ClearButton
            disabled={!output}
            onClear={() => {
              setOutput("");
              setError("");
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
                label="Copy password"
              />
            </ToolActions>
          }
          description="Generated with crypto.getRandomValues. Passwords are never saved to tool history."
          id="password-output"
          label="Generated password"
          value={output}
        />
      </div>
    </form>
  );
}
