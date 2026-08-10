import { phaseTwoTools } from "./phase-two-tools";
import { phaseThreeTools } from "./phase-three-tools";
import { phaseFourTools } from "./phase-four-tools";
import { imageConversionTools } from "./image-conversion-tools";
import type { CategoryDefinition, ToolDefinition } from "./types";
import { assertValidRegistry } from "./validation";

export const categoryRegistry = [
  {
    slug: "developer",
    name: "Developer",
    shortDescription: "Format, inspect, and transform developer data.",
    description:
      "Focused utilities for common development tasks, designed to keep pasted data in your browser.",
    selectionGuide:
      "Use formatters when you need readable structure, minifiers when payload size matters, and generators when you need standards-compliant values for development or testing.",
    icon: "code-2",
    order: 1,
  },
  {
    slug: "text",
    name: "Text",
    shortDescription: "Count, clean, and reshape written content.",
    description:
      "Straightforward text tools for writers, students, marketers, and anyone working with words.",
    selectionGuide:
      "Choose a counter to measure existing copy, a converter to reshape capitalization, or a cleanup tool to normalize lists without uploading the text.",
    icon: "type",
    order: 2,
  },
  {
    slug: "encoding",
    name: "Encoding",
    shortDescription: "Encode and decode common web formats.",
    description:
      "Browser-based encoders and decoders with clear errors and careful Unicode handling.",
    selectionGuide:
      "Base64 is useful for representing binary-safe text, while URL encoding is designed for query values, path segments, and complete web addresses.",
    icon: "binary",
    order: 3,
  },
  {
    slug: "web",
    name: "Web",
    shortDescription: "Prepare and inspect browser-facing markup.",
    description:
      "Local utilities for HTML and Markdown workflows with careful output handling and sanitization.",
    selectionGuide:
      "Use escaping for literal HTML characters, formatting for readable markup, and the sanitized previewer when you need to review Markdown output safely.",
    icon: "globe-2",
    order: 4,
  },
  {
    slug: "image-conversion",
    name: "Image & Conversion",
    shortDescription: "Generate visual outputs directly in your browser.",
    description:
      "Practical visual conversion tools that keep source content and generated files on your device.",
    selectionGuide:
      "Start with the result you need: create a QR code, convert or resize an image, crop it for a layout, compress its file size, or create a new export without copying its original metadata containers.",
    icon: "image",
    order: 5,
  },
  {
    slug: "security",
    name: "Security",
    shortDescription: "Generate and inspect sensitive values locally.",
    description:
      "Privacy-conscious security helpers built around modern browser cryptography and safe defaults.",
    selectionGuide:
      "Generate new secrets with cryptographic browser APIs, create one-way digests with the hash tool, and treat decoded tokens as unverified data until a trusted system checks them.",
    icon: "shield-check",
    order: 6,
  },
  {
    slug: "date-time",
    name: "Date & Time",
    shortDescription: "Convert dates, timestamps, and durations.",
    description:
      "Accurate date and time utilities that explain time zones, units, and calendar assumptions.",
    selectionGuide:
      "Use timestamp conversion for exact instants and units; use calendar-based calculators when years, months, leap days, and date-only comparisons matter.",
    icon: "clock-3",
    order: 7,
  },
  {
    slug: "calculators",
    name: "Calculators",
    shortDescription: "Solve everyday calculations without clutter.",
    description:
      "Clear calculators for common questions, with visible formulas and careful edge-case handling.",
    selectionGuide:
      "Pick the calculator that matches the question rather than adapting your numbers to a generic form. Each tool labels its assumptions and invalid cases.",
    icon: "calculator",
    order: 8,
  },
  {
    slug: "color-design",
    name: "Color & Design",
    shortDescription: "Convert colors and prepare visual assets.",
    description:
      "Practical visual utilities with accessible output and local browser processing.",
    selectionGuide:
      "Use color conversion to move between HEX, RGB, and HSL while keeping the same visual color, including supported alpha values.",
    icon: "palette",
    order: 9,
  },
] as const satisfies readonly CategoryDefinition[];

// Add a complete definition only alongside its logic, tests, content, and lazy
// workspace loader. Drafts remain out of public selectors and generated routes.
export const toolRegistry = [
  {
    slug: "json-formatter",
    name: "JSON Formatter and Validator",
    shortDescription: "Validate JSON and format it with readable indentation.",
    longDescription:
      "Paste JSON to check its syntax and turn compact or uneven data into a clean, two-space-indented result. Parser errors retain the browser's original detail so you can find malformed input quickly.",
    category: "developer",
    keywords: ["JSON", "formatter", "validator", "pretty print"],
    aliases: ["beautify JSON", "JSON checker", "pretty JSON"],
    icon: "braces",
    relatedTools: [
      "json-minifier",
      "base64-encoder-decoder",
      "url-encoder-decoder",
    ],
    featured: true,
    searchWeight: 100,
    popularRank: 1,
    privacyNote:
      "Your JSON is parsed and formatted entirely in this browser tab.",
    browserProcessing: true,
    sensitive: false,
    inputType: "structured-data",
    outputType: "structured-data",
    usageSteps: [
      "Paste or type JSON in the input panel.",
      "Select Format and validate to parse the value.",
      "Review the formatted result, then copy or download it.",
    ],
    examples: [
      {
        name: "Format an API response",
        input: '{"user":{"id":42,"active":true},"roles":["editor","reviewer"]}',
        output:
          '{\n  "user": {\n    "id": 42,\n    "active": true\n  },\n  "roles": [\n    "editor",\n    "reviewer"\n  ]\n}',
      },
    ],
    faqs: [
      {
        question: "Does formatting change JSON values?",
        answer:
          "No. It parses the value and serializes the same data with two-space indentation. Whitespace inside quoted strings remains part of the value.",
      },
      {
        question:
          "Why does the validation message look different between browsers?",
        answer:
          "PixelUtils adds a clear Invalid JSON label but preserves the native parser detail, which browser engines may phrase differently.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "JSON Formatter and Validator – Private Online Tool",
      description:
        "Format and validate JSON in your browser with readable output and useful native parser details. Your pasted data stays on your device.",
    },
    status: "published",
  },
  {
    slug: "json-minifier",
    name: "JSON Minifier",
    shortDescription: "Validate JSON and remove insignificant whitespace.",
    longDescription:
      "Turn formatted JSON into a compact representation after a full syntax check. Spaces inside quoted values stay intact while indentation, line breaks, and structural spacing are removed.",
    category: "developer",
    keywords: ["JSON", "minifier", "compact", "compress"],
    aliases: ["minify JSON", "compact JSON", "remove JSON whitespace"],
    icon: "file-json",
    relatedTools: [
      "json-formatter",
      "base64-encoder-decoder",
      "url-encoder-decoder",
    ],
    featured: false,
    searchWeight: 76,
    popularRank: 6,
    privacyNote:
      "Minification runs locally; the JSON never leaves your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "structured-data",
    outputType: "structured-data",
    usageSteps: [
      "Paste valid or unverified JSON into the input.",
      "Choose Validate and minify.",
      "Copy the compact result or download it as JSON.",
    ],
    examples: [
      {
        name: "Compact configuration",
        input: '{\n  "theme": "dark",\n  "features": ["search", "history"]\n}',
        output: '{"theme":"dark","features":["search","history"]}',
      },
    ],
    faqs: [
      {
        question: "Is JSON minification the same as compression?",
        answer:
          "It reduces text size by removing insignificant whitespace, but it does not apply binary compression such as gzip.",
      },
      {
        question: "Are spaces in string values removed?",
        answer:
          "No. Only whitespace outside JSON string values is removed, so text content keeps its original spaces.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "JSON Minifier – Validate and Compact JSON Online",
      description:
        "Validate and minify JSON locally without altering string content. Copy or download compact JSON directly from your browser.",
    },
    status: "published",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder and Decoder",
    shortDescription: "Encode Unicode text to Base64 or decode it safely.",
    longDescription:
      "Convert UTF-8 text to Base64 and decode Base64 back to readable Unicode. The decoder checks padding and rejects byte sequences that are not valid UTF-8 text.",
    category: "encoding",
    keywords: ["Base64", "encode", "decode", "UTF-8"],
    aliases: ["Base64 converter", "text to Base64", "Base64 to text"],
    icon: "binary",
    relatedTools: ["url-encoder-decoder", "json-formatter", "json-minifier"],
    featured: true,
    searchWeight: 96,
    popularRank: 2,
    privacyNote:
      "Encoding and decoding happen locally, including Unicode conversion.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Choose Encode or Decode.",
      "Enter plain UTF-8 text or a Base64 value.",
      "Run the conversion, then copy or download the result.",
    ],
    examples: [
      {
        name: "Encode multilingual text",
        input: "Hello, café 👋",
        output: "SGVsbG8sIGNhZsOpIPCfkYs=",
      },
    ],
    faqs: [
      {
        question: "Can this encode emoji and accented characters?",
        answer:
          "Yes. Text is converted to UTF-8 bytes before Base64 encoding, so Unicode text round-trips correctly.",
      },
      {
        question: "Does Base64 encrypt my text?",
        answer:
          "No. Base64 is a reversible representation, not encryption, and should not be used to protect secrets.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Base64 Encoder and Decoder – Unicode-Safe Online Tool",
      description:
        "Encode UTF-8 text to Base64 or decode Base64 to Unicode locally. Handles emoji and accented characters without uploading data.",
    },
    status: "published",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder and Decoder",
    shortDescription: "Encode or decode URL components and complete URLs.",
    longDescription:
      "Percent-encode query values and path segments, or preserve separators while encoding a full URL. Clear modes prevent structural characters from being escaped by accident.",
    category: "encoding",
    keywords: ["URL", "percent encoding", "encode", "decode"],
    aliases: ["URL escape", "URL unescape", "encodeURIComponent"],
    icon: "link",
    relatedTools: ["base64-encoder-decoder", "json-formatter", "json-minifier"],
    featured: false,
    searchWeight: 74,
    popularRank: 7,
    privacyNote:
      "URLs and text are transformed in memory in your browser only.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Choose component mode for a query value or full URL mode for an address.",
      "Select Encode or Decode and enter the value.",
      "Convert, then copy or download the output.",
    ],
    examples: [
      {
        name: "Encode a query value",
        input: "coffee & café",
        output: "coffee%20%26%20caf%C3%A9",
      },
    ],
    faqs: [
      {
        question: "When should I use component mode?",
        answer:
          "Use it for one query value or path segment. It escapes separators such as ampersands, equals signs, and slashes.",
      },
      {
        question: "Why can decoding fail?",
        answer:
          "A percent sign must be followed by two hexadecimal digits, and the resulting bytes must form valid encoded text.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "URL Encoder and Decoder – Percent-Encoding Tool",
      description:
        "Encode and decode URL components or full URLs with explicit modes. Percent-encoding stays private and runs entirely in your browser.",
    },
    status: "published",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortDescription:
      "Generate one or many cryptographically random UUID v4 values.",
    longDescription:
      "Create up to 100 lowercase UUID version 4 identifiers at once. Version and variant bits are set correctly, while random bytes come from the browser's cryptographic generator.",
    category: "developer",
    keywords: ["UUID", "GUID", "version 4", "identifier"],
    aliases: ["UUID v4 generator", "GUID generator", "random ID"],
    icon: "fingerprint",
    relatedTools: [
      "password-generator",
      "json-formatter",
      "unix-timestamp-converter",
    ],
    featured: false,
    searchWeight: 86,
    popularRank: 4,
    privacyNote:
      "UUIDs are generated locally with the browser's secure random source.",
    browserProcessing: true,
    sensitive: false,
    inputType: "number",
    outputType: "text",
    usageSteps: [
      "Enter a quantity from 1 to 100.",
      "Choose Generate UUIDs.",
      "Copy the list or download it as a text file.",
    ],
    examples: [
      {
        name: "Generate one UUID v4",
        input: "1",
        output: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      },
    ],
    faqs: [
      {
        question: "Are the generated UUIDs version 4?",
        answer:
          "Yes. The generator applies UUID v4 version and variant bits to cryptographically random bytes.",
      },
      {
        question: "Can a UUID still collide?",
        answer:
          "A collision is theoretically possible, but the random space is so large that properly generated UUID v4 collisions are extraordinarily unlikely.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "UUID Generator – Secure UUID v4 Values in Your Browser",
      description:
        "Generate up to 100 UUID v4 identifiers using browser cryptography. Copy or download lowercase UUIDs without a server request.",
    },
    status: "published",
  },
  {
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    shortDescription:
      "Convert timestamps to dates and dates back to Unix time.",
    longDescription:
      "Translate Unix seconds or milliseconds into explicit UTC and local dates, or convert a local date and time in the opposite direction. Units are always selected rather than guessed.",
    category: "date-time",
    keywords: ["Unix timestamp", "epoch", "date converter", "milliseconds"],
    aliases: ["epoch converter", "timestamp to date", "date to timestamp"],
    icon: "clock-3",
    relatedTools: [
      "uuid-generator",
      "json-formatter",
      "word-character-counter",
    ],
    featured: true,
    searchWeight: 82,
    popularRank: 5,
    privacyNote:
      "Date conversion uses your browser's clock and time-zone settings only.",
    browserProcessing: true,
    sensitive: false,
    inputType: "date",
    outputType: "text",
    usageSteps: [
      "Choose a conversion direction and select seconds or milliseconds.",
      "Enter a timestamp or local date and time.",
      "Convert and review the explicitly labeled UTC and local result.",
    ],
    examples: [
      {
        name: "Convert seconds to UTC",
        input: "1704067200 seconds",
        output: "2024-01-01T00:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "How do seconds and milliseconds differ?",
        answer:
          "Unix seconds count one unit per second; milliseconds count 1,000 units per second. The same digits represent very different dates, so this tool never guesses.",
      },
      {
        question: "Which time zone is used?",
        answer:
          "Timestamp results show UTC and your browser's local representation. A date entered through the date-time control is interpreted in your local time zone.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Unix Timestamp Converter – Seconds, Milliseconds and Dates",
      description:
        "Convert Unix timestamps to UTC and local dates or dates back to epoch time. Seconds and milliseconds are clearly separated.",
    },
    status: "published",
  },
  {
    slug: "word-character-counter",
    name: "Word and Character Counter",
    shortDescription:
      "Count words, Unicode characters, lines, and sentences live.",
    longDescription:
      "Measure text as you type or paste it, with separate totals for words, Unicode characters, non-whitespace characters, lines, and sentences. Punctuation and whitespace follow clear, practical rules.",
    category: "text",
    keywords: ["word count", "character count", "line count", "sentence count"],
    aliases: ["text counter", "letter counter", "count words"],
    icon: "letter-text",
    relatedTools: [
      "text-case-converter",
      "duplicate-line-remover",
      "unix-timestamp-converter",
    ],
    featured: true,
    searchWeight: 90,
    popularRank: 3,
    privacyNote:
      "Your text is counted live in memory and is not sent or saved.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "number",
    usageSteps: [
      "Type or paste text into the editor.",
      "Read the live word, character, line, and sentence totals.",
      "Copy or download a compact count summary if needed.",
    ],
    examples: [
      {
        name: "Count a short note",
        input: "Hello, world!\nA second line.",
        output: "Words: 5; Characters: 28; Lines: 2; Sentences: 2",
      },
    ],
    faqs: [
      {
        question: "How are words counted?",
        answer:
          "Runs of Unicode letters or numbers count as words, with internal apostrophes and hyphens kept together. Punctuation and emoji alone do not count as words.",
      },
      {
        question: "What does character count include?",
        answer:
          "The main total counts Unicode code points, including spaces and line breaks. A second total excludes all whitespace.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Word and Character Counter – Live Private Text Counts",
      description:
        "Count words, Unicode characters, lines and sentences instantly in your browser. Clear rules and no text uploads or account required.",
    },
    status: "published",
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    shortDescription: "Switch text between writing and identifier case styles.",
    longDescription:
      "Convert text to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, or kebab-case. Natural-language modes retain punctuation while identifier modes normalize separators.",
    category: "text",
    keywords: ["text case", "uppercase", "lowercase", "camel case"],
    aliases: ["case changer", "title case converter", "snake case converter"],
    icon: "case-sensitive",
    relatedTools: [
      "word-character-counter",
      "duplicate-line-remover",
      "url-encoder-decoder",
    ],
    featured: false,
    searchWeight: 72,
    popularRank: 8,
    privacyNote: "Case conversion runs locally without storing your text.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Select the case style you need.",
      "Paste or type the source text and choose Convert case.",
      "Copy or download the converted result.",
    ],
    examples: [
      {
        name: "Create a variable name",
        input: "private browser tools",
        output: "privateBrowserTools",
      },
    ],
    faqs: [
      {
        question: "What happens to punctuation?",
        answer:
          "Uppercase, lowercase, title, and sentence modes retain punctuation. Identifier modes use word tokens and replace separators with the selected naming style.",
      },
      {
        question: "Does the converter support accented letters?",
        answer:
          "Yes. It uses locale-aware JavaScript case conversion and Unicode-aware word matching where practical.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Text Case Converter – Title, Camel, Snake and More",
      description:
        "Convert text to upper, lower, title, sentence, camel, Pascal, snake or kebab case locally with Unicode-aware transformations.",
    },
    status: "published",
  },
  {
    slug: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    shortDescription:
      "Remove repeated lines while preserving their first occurrence.",
    longDescription:
      "Clean lists and pasted columns without reordering them. Choose case-sensitive or case-insensitive matching, optionally ignore surrounding spaces, and remove empty lines when useful.",
    category: "text",
    keywords: [
      "duplicate lines",
      "unique lines",
      "deduplicate",
      "list cleaner",
    ],
    aliases: ["remove repeated lines", "line deduplicator", "unique list"],
    icon: "list-x",
    relatedTools: [
      "text-case-converter",
      "word-character-counter",
      "json-minifier",
    ],
    featured: false,
    searchWeight: 68,
    popularRank: 9,
    privacyNote:
      "Line comparison and cleanup take place entirely in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Paste one item per line.",
      "Set case, whitespace, and empty-line comparison options.",
      "Remove duplicates, then copy or download the unique lines.",
    ],
    examples: [
      {
        name: "Deduplicate without reordering",
        input: "beta\nalpha\nbeta\ngamma",
        output: "beta\nalpha\ngamma",
      },
    ],
    faqs: [
      {
        question: "Which duplicate line is kept?",
        answer:
          "The first matching line is kept exactly as entered, and later matches are removed without sorting the list.",
      },
      {
        question: "How does case-insensitive mode work?",
        answer:
          "Lines are compared after locale-aware lowercase conversion. The original capitalization of the first matching line is preserved.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Duplicate Line Remover – Keep Unique Lines in Order",
      description:
        "Remove duplicate lines locally with case and whitespace options. Preserve first-occurrence order, then copy or download the cleaned list.",
    },
    status: "published",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Create strong passwords with unbiased browser cryptography.",
    longDescription:
      "Generate passwords from selected character groups with a configurable length and an option to remove look-alike characters. Secure rejection sampling avoids modulo bias, and each selected group is represented.",
    category: "security",
    keywords: [
      "password",
      "secure generator",
      "random password",
      "cryptography",
    ],
    aliases: [
      "strong password generator",
      "random password maker",
      "secure password",
    ],
    icon: "key-round",
    relatedTools: [
      "uuid-generator",
      "base64-encoder-decoder",
      "url-encoder-decoder",
    ],
    featured: false,
    searchWeight: 84,
    popularRank: 10,
    privacyNote:
      "Passwords are generated with crypto.getRandomValues and are never stored in history.",
    browserProcessing: true,
    sensitive: true,
    inputType: "number",
    outputType: "text",
    usageSteps: [
      "Choose a length and at least one character group.",
      "Optionally exclude characters that are easy to confuse.",
      "Generate the password and copy it directly to your password manager.",
    ],
    examples: [
      {
        name: "Create a 20-character mixed password",
        input: "Length 20; uppercase, lowercase, numbers, symbols",
        output:
          "A different cryptographically random 20-character value each time",
      },
    ],
    faqs: [
      {
        question: "Is Math.random used?",
        answer:
          "No. Random bytes come exclusively from the browser's crypto.getRandomValues API, with rejection sampling to avoid character-selection bias.",
      },
      {
        question: "Does PixelUtils save generated passwords?",
        answer:
          "No. Password output is not written to local history, analytics, a URL, or a server. Copy it before leaving the page.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Secure Password Generator – Private Browser Cryptography",
      description:
        "Generate strong passwords locally with crypto.getRandomValues, unbiased selection, custom length and character options. Nothing is stored.",
    },
    status: "published",
  },
  ...phaseTwoTools,
  ...phaseThreeTools,
  ...phaseFourTools,
  ...imageConversionTools,
] as const satisfies readonly ToolDefinition[];

export type ToolSlug = (typeof toolRegistry)[number]["slug"];
export type RegisteredTool = (typeof toolRegistry)[number];

// Structural/content validation remains a build-time failure without importing
// the React workspace loader manifest. The manifest is independently enforced
// as Record<ToolSlug, Loader> and cross-checked in registry validation tests.
assertValidRegistry(
  categoryRegistry,
  toolRegistry,
  toolRegistry
    .filter((tool) => tool.status === "published")
    .map((tool) => tool.slug),
);

const allTools: readonly RegisteredTool[] = toolRegistry;
const categoriesBySlug = new Map(
  categoryRegistry.map((category) => [category.slug, category]),
);
export const publishedTools = allTools.filter(
  (tool) => tool.status === "published",
);
const publishedToolsBySlug = new Map(
  publishedTools.map((tool) => [tool.slug, tool]),
);
const publishedToolsByCategory = new Map<
  RegisteredTool["category"],
  RegisteredTool[]
>();
for (const tool of publishedTools) {
  const categoryTools = publishedToolsByCategory.get(tool.category) ?? [];
  categoryTools.push(tool);
  publishedToolsByCategory.set(tool.category, categoryTools);
}

export const publishedCategories = categoryRegistry.filter((category) =>
  publishedTools.some((tool) => tool.category === category.slug),
);

export const featuredTools = publishedTools.filter((tool) => tool.featured);

export const publishedToolCards = publishedTools.map(
  ({ slug, name, shortDescription, category, icon, browserProcessing }) => ({
    slug,
    name,
    shortDescription,
    category,
    icon,
    browserProcessing,
  }),
);

export const popularTools = publishedTools
  .filter(
    (tool): tool is RegisteredTool & { readonly popularRank: number } =>
      "popularRank" in tool && tool.popularRank !== undefined,
  )
  .toSorted((left, right) => left.popularRank - right.popularRank);

export function findCategory(slug: string) {
  return categoriesBySlug.get(
    slug as (typeof categoryRegistry)[number]["slug"],
  );
}

export function findTool(slug: string) {
  return publishedToolsBySlug.get(slug as ToolSlug);
}

export function getToolsForCategory(categorySlug: string) {
  return (
    publishedToolsByCategory.get(categorySlug as RegisteredTool["category"]) ??
    []
  );
}

export function getRelatedTools(tool: ToolDefinition) {
  return tool.relatedTools
    .map(findTool)
    .filter(
      (relatedTool): relatedTool is RegisteredTool => relatedTool !== undefined,
    );
}

export function getToolCount(categorySlug?: string) {
  return categorySlug
    ? getToolsForCategory(categorySlug).length
    : publishedTools.length;
}

export function getCategoryToolCounts() {
  return Object.fromEntries(
    categoryRegistry.map((category) => [
      category.slug,
      getToolsForCategory(category.slug).length,
    ]),
  ) as Record<(typeof categoryRegistry)[number]["slug"], number>;
}
