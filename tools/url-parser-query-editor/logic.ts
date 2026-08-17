export type QueryParameter = {
  readonly key: string;
  readonly value: string;
};

export type ParsedUrl = {
  readonly protocol: string;
  readonly host: string;
  readonly hostname: string;
  readonly port: string;
  readonly path: string;
  readonly hash: string;
  readonly hasCredentials: boolean;
  readonly query: readonly QueryParameter[];
};

export type UrlParseResult =
  | { readonly ok: true; readonly value: ParsedUrl }
  | { readonly ok: false; readonly error: string };

function getUrl(input: string) {
  if (!input.trim()) throw new Error("Enter a URL to parse.");
  const url = new URL(input.trim());
  if (!url.hostname)
    throw new Error(
      "Enter a full URL with a hostname, such as https://example.com/path.",
    );
  return url;
}

export function parseUrl(input: string): UrlParseResult {
  try {
    const url = getUrl(input);
    return {
      ok: true,
      value: {
        protocol: url.protocol.replace(/:$/, ""),
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        hash: url.hash.replace(/^#/, ""),
        hasCredentials: Boolean(url.username || url.password),
        query: [...url.searchParams].map(([key, value]) => ({ key, value })),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "The URL could not be parsed.",
    };
  }
}

export function buildUrl(
  input: string,
  query: readonly QueryParameter[],
): UrlParseResult & { readonly output?: string } {
  try {
    const url = getUrl(input);
    url.search = "";
    for (const parameter of query)
      url.searchParams.append(parameter.key, parameter.value);
    const output = url.toString();
    const parsed = parseUrl(output);
    if (!parsed.ok) return parsed;
    return { ok: true, value: parsed.value, output };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The URL could not be rebuilt.",
    };
  }
}

export function moveQueryParameter(
  parameters: readonly QueryParameter[],
  fromIndex: number,
  toIndex: number,
) {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= parameters.length ||
    toIndex >= parameters.length ||
    fromIndex === toIndex
  )
    return [...parameters];
  const next = [...parameters];
  const [parameter] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, parameter);
  return next;
}
