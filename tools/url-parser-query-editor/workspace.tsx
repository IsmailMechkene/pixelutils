"use client";

import { useState } from "react";

import {
  ActionButton,
  ClearButton,
  CopyButton,
  ErrorMessage,
  SampleButton,
  TextOutputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  buildUrl,
  moveQueryParameter,
  parseUrl,
  type ParsedUrl,
  type QueryParameter,
} from "./logic";

const sampleUrl =
  "https://example.com/search?tag=design&tag=tools&q=coffee%20and%20tea#results";
const inputClass =
  "min-h-11 w-full rounded-control border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-accent";

export default function UrlParserQueryEditorWorkspace({
  slug,
}: {
  slug: string;
}) {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedUrl>();
  const [query, setQuery] = useState<QueryParameter[]>([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function parseInput() {
    const result = parseUrl(input);
    if (!result.ok) {
      setError(result.error);
      setParsed(undefined);
      setQuery([]);
      setOutput("");
      return;
    }
    setError("");
    setParsed(result.value);
    setQuery([...result.value.query]);
    setOutput("");
    recordToolHistory(slug, "processed", { sensitive: false });
  }

  function changeQuery(nextQuery: QueryParameter[]) {
    setQuery(nextQuery);
    setOutput("");
  }

  function rebuild() {
    const result = buildUrl(input, query);
    if (!result.ok || !result.output) {
      setError(result.ok ? "The URL could not be rebuilt." : result.error);
      return;
    }
    setInput(result.output);
    setParsed(result.value);
    setQuery([...result.value.query]);
    setOutput(result.output);
    setError("");
    recordToolHistory(slug, "processed", { sensitive: false });
  }

  function clearAll() {
    setInput("");
    setParsed(undefined);
    setQuery([]);
    setOutput("");
    setError("");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        parseInput();
      }}
    >
      <ToolNotice title="Private by design" tone="info">
        URLs are parsed and rebuilt only in your browser. They are never
        uploaded, logged, or saved.
      </ToolNotice>
      <label
        className="mt-5 grid gap-2 text-sm font-semibold text-ink"
        htmlFor="url-parser-input"
      >
        Full URL
        <input
          aria-describedby={error ? "url-parser-error" : undefined}
          aria-invalid={Boolean(error)}
          className={inputClass}
          id="url-parser-input"
          onChange={(event) => {
            setInput(event.target.value);
            setError("");
          }}
          placeholder="https://example.com/search?tag=tools"
          spellCheck={false}
          value={input}
        />
      </label>
      {error ? (
        <div className="mt-3">
          <ErrorMessage id="url-parser-error" message={error} />
        </div>
      ) : null}
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions label="URL parser actions">
          <ActionButton icon="search" tone="primary" type="submit">
            Parse URL
          </ActionButton>
          <SampleButton
            onSample={() => {
              setInput(sampleUrl);
              setParsed(undefined);
              setQuery([]);
              setOutput("");
              setError("");
            }}
          />
          <ClearButton disabled={!input && !parsed} onClear={clearAll} />
        </ToolActions>
      </div>

      {parsed ? (
        <section aria-labelledby="url-components-title" className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              className="text-base font-bold text-ink"
              id="url-components-title"
            >
              URL components
            </h2>
            <p className="text-xs text-ink-subtle">
              {query.length}{" "}
              {query.length === 1 ? "query parameter" : "query parameters"}
            </p>
          </div>
          {parsed.hasCredentials ? (
            <div className="mt-3">
              <ToolNotice title="Credentials detected" tone="warning">
                This URL includes credentials. Treat it as sensitive and avoid
                sharing or copying it into logs.
              </ToolNotice>
            </div>
          ) : null}
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-line bg-panel-muted p-3">
              <dt className="mono-label text-ink-subtle">Protocol</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {parsed.protocol}
              </dd>
            </div>
            <div className="rounded-card border border-line bg-panel-muted p-3">
              <dt className="mono-label text-ink-subtle">Host</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {parsed.host}
              </dd>
            </div>
            <div className="rounded-card border border-line bg-panel-muted p-3">
              <dt className="mono-label text-ink-subtle">Hostname</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {parsed.hostname}
              </dd>
            </div>
            <div className="rounded-card border border-line bg-panel-muted p-3">
              <dt className="mono-label text-ink-subtle">Port</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {parsed.port || "Default"}
              </dd>
            </div>
            <div className="rounded-card border border-line bg-panel-muted p-3">
              <dt className="mono-label text-ink-subtle">Path</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {parsed.path}
              </dd>
            </div>
            <div className="rounded-card border border-line bg-panel-muted p-3">
              <dt className="mono-label text-ink-subtle">Fragment</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">
                {parsed.hash || "None"}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {parsed ? (
        <section
          aria-labelledby="query-editor-title"
          className="mt-6 rounded-card border border-line bg-panel-muted p-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              className="text-base font-bold text-ink"
              id="query-editor-title"
            >
              Query string editor
            </h2>
            <button
              className="min-h-11 rounded-control border border-line bg-panel px-3 text-sm font-semibold text-ink"
              onClick={() => changeQuery([...query, { key: "", value: "" }])}
              type="button"
            >
              Add parameter
            </button>
          </div>
          <p className="mt-1 text-xs leading-5 text-ink-subtle">
            Parameter order and duplicate keys are preserved. Rebuilding applies
            standard URL percent-encoding.
          </p>
          <div className="mt-4 grid gap-3">
            {query.length ? (
              query.map((parameter, index) => (
                <div
                  className="grid gap-2 rounded-control border border-line bg-panel p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                  key={`${index}-${parameter.key}`}
                >
                  <input
                    aria-label={`Query parameter ${index + 1} key`}
                    className={inputClass}
                    onChange={(event) =>
                      changeQuery(
                        query.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, key: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Key"
                    value={parameter.key}
                  />
                  <input
                    aria-label={`Query parameter ${index + 1} value`}
                    className={inputClass}
                    onChange={(event) =>
                      changeQuery(
                        query.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, value: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Value"
                    value={parameter.value}
                  />
                  <div className="flex gap-2">
                    <button
                      aria-label={`Move parameter ${index + 1} up`}
                      className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold text-ink disabled:opacity-50"
                      disabled={index === 0}
                      onClick={() =>
                        changeQuery(moveQueryParameter(query, index, index - 1))
                      }
                      type="button"
                    >
                      Up
                    </button>
                    <button
                      aria-label={`Move parameter ${index + 1} down`}
                      className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold text-ink disabled:opacity-50"
                      disabled={index === query.length - 1}
                      onClick={() =>
                        changeQuery(moveQueryParameter(query, index, index + 1))
                      }
                      type="button"
                    >
                      Down
                    </button>
                    <button
                      aria-label={`Remove parameter ${index + 1}`}
                      className="min-h-11 rounded-control border border-line px-3 text-sm font-semibold text-ink"
                      onClick={() =>
                        changeQuery(
                          query.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-control border border-dashed border-line p-3 text-sm text-ink-muted">
                This URL has no query parameters. Add one to build a query
                string.
              </p>
            )}
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <ToolActions label="Query editor actions">
              <ActionButton
                icon="refresh-cw"
                onClick={rebuild}
                tone="primary"
                type="button"
              >
                Rebuild URL
              </ActionButton>
            </ToolActions>
          </div>
        </section>
      ) : null}
      {output ? (
        <div className="mt-6">
          <TextOutputPanel
            actions={<CopyButton value={output} />}
            id="rebuilt-url-output"
            label="Rebuilt URL"
            value={output}
          />
        </div>
      ) : null}
    </form>
  );
}
