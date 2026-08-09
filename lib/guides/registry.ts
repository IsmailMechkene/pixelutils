import type { GuideDefinition } from "./types";
import { assertValidGuideRegistry } from "./validation";

export const guideRegistry: readonly GuideDefinition[] = [
  {
    slug: "format-and-validate-json-safely",
    title: "How to format and validate JSON safely",
    description:
      "Learn how to validate and format JSON, understand common parse errors, and keep API data local while you work.",
    summary:
      "A practical way to turn compact or invalid JSON into readable, trustworthy data without uploading it to a third-party service.",
    category: "Developer guide",
    readingTime: "4 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    primaryToolSlug: "json-formatter",
    relatedToolSlugs: [
      "json-minifier",
      "base64-encoder-decoder",
      "jwt-decoder",
    ],
    relatedGuideSlugs: ["json-formatter-vs-json-minifier"],
    sections: [
      {
        id: "what-formatting-does",
        heading: "What JSON formatting actually changes",
        paragraphs: [
          "JSON formatting changes structural whitespace: indentation, line breaks, and spaces around commas and colons. It does not change keys, numbers, booleans, arrays, objects, or text inside quotation marks.",
          "That makes formatting useful when an API response, configuration file, or copied payload arrives as one long line. You can inspect the same data more easily without changing its meaning.",
        ],
        codeExample: {
          label: "Compact JSON becomes readable JSON",
          language: "json",
          value:
            '{"user":{"id":42,"active":true},"roles":["editor","reviewer"]}\n\nbecomes\n\n{\n  "user": {\n    "id": 42,\n    "active": true\n  },\n  "roles": [\n    "editor",\n    "reviewer"\n  ]\n}',
        },
      },
      {
        id: "validate-before-use",
        heading: "Validate before you format or reuse data",
        paragraphs: [
          "A formatter should parse the input first. If it is valid JSON, it can serialize the same value with consistent indentation. If it is invalid, the useful outcome is an error that points you toward the syntax problem rather than a misleading result.",
          "JSON requires double-quoted object keys and string values. Trailing commas, comments, single quotes, and unquoted keys are common in JavaScript-like configuration, but they are not valid JSON.",
        ],
        steps: [
          "Paste the complete value, including the opening and closing braces or brackets.",
          "Format and validate it before sending it to another tool or service.",
          "If parsing fails, correct the first syntax error and run validation again.",
        ],
      },
      {
        id: "common-errors",
        heading: "The mistakes that most often break JSON",
        paragraphs: [
          "Missing commas between properties and a final trailing comma are the usual causes. Another common issue is a pasted string that contains a literal line break rather than the escaped sequence `\\n`.",
          "Do not try to repair an error by blindly replacing every quote or comma. Read the parser message alongside the surrounding line, then make the smallest correction. That protects valid text values from accidental changes.",
        ],
      },
      {
        id: "keep-sensitive-data-local",
        heading: "Treat pasted JSON as potentially sensitive",
        paragraphs: [
          "JSON can contain account identifiers, internal URLs, feature flags, or API responses. Before using an online formatter, check whether it sends the content to a server or records it in logs.",
          "PixelUtils formats and validates JSON in the browser tab. That does not make a secret safe to share elsewhere, but it avoids an unnecessary upload for this routine task.",
        ],
      },
    ],
  },
  {
    slug: "json-formatter-vs-json-minifier",
    title: "JSON Formatter vs JSON Minifier: when to use each",
    description:
      "Understand the difference between formatting and minifying JSON, when each is useful, and how to preserve valid data.",
    summary:
      "Formatting makes valid JSON easier to read. Minifying removes insignificant whitespace to make the same valid JSON more compact.",
    category: "Developer guide",
    readingTime: "3 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-09",
    primaryToolSlug: "json-minifier",
    relatedToolSlugs: [
      "json-formatter",
      "base64-encoder-decoder",
      "url-encoder-decoder",
    ],
    relatedGuideSlugs: ["format-and-validate-json-safely"],
    sections: [
      {
        id: "the-short-answer",
        heading: "The short answer",
        paragraphs: [
          "Use a JSON formatter when a person needs to read, review, debug, or edit the data. Use a JSON minifier when a valid JSON value needs to take fewer characters, for example in a compact fixture or a manually embedded payload.",
          "Both operations should preserve the JSON value. The difference is only the whitespace between structural tokens.",
        ],
      },
      {
        id: "when-to-format",
        heading: "Choose formatting for review and debugging",
        paragraphs: [
          "Nested objects are much easier to inspect once each level has indentation. Formatting also makes missing properties, unexpectedly empty arrays, and the shape of an API response clearer at a glance.",
          "A formatter is the safer first step when you copied JSON from a log, network response, or configuration file because it validates syntax before presenting output.",
        ],
        steps: [
          "Format a compact API response before comparing it with an expected payload.",
          "Format a JSON configuration before editing it by hand.",
          "Format a decoded JSON segment when you need to inspect its structure.",
        ],
      },
      {
        id: "when-to-minify",
        heading: "Choose minifying for compact, valid output",
        paragraphs: [
          "Minifying removes indentation, line breaks, and structural spaces. It does not shorten property names, remove fields, or compress text inside string values. A long description remains long after minification because changing it would alter the data.",
          "Minification is not a substitute for transport compression such as gzip or Brotli. Those are server or delivery concerns; JSON minification is simply a representation choice.",
        ],
        codeExample: {
          label: "Same value, different whitespace",
          language: "json",
          value:
            '{\n  "enabled": true,\n  "items": [1, 2, 3]\n}\n\nbecomes\n\n{"enabled":true,"items":[1,2,3]}',
        },
      },
      {
        id: "safe-workflow",
        heading: "A safe JSON workflow",
        paragraphs: [
          "Validate first, then choose the representation that suits the next task. Keep the readable formatted copy while you are reviewing or editing; create a minified copy only when you specifically need compact output.",
          "If the source may contain private data, choose a tool that processes it locally and avoid pasting it into issue trackers, chat messages, or public examples.",
        ],
      },
    ],
  },
];

assertValidGuideRegistry(guideRegistry);

export type GuideSlug = GuideDefinition["slug"];

export const publishedGuides = guideRegistry;

const guidesBySlug = new Map(guideRegistry.map((guide) => [guide.slug, guide]));

export function findGuide(slug: string) {
  return guidesBySlug.get(slug as GuideSlug);
}

export function getRelatedGuides(guide: GuideDefinition) {
  return guide.relatedGuideSlugs
    .map(findGuide)
    .filter(
      (relatedGuide): relatedGuide is GuideDefinition => relatedGuide !== undefined,
    );
}
