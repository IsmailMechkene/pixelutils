import type { ToolDefinition } from "./types";

export const phaseTwoTools = [
  {
    slug: "html-escape-unescape",
    name: "HTML Escape and Unescape",
    shortDescription: "Convert unsafe HTML characters to entities and back.",
    longDescription:
      "Escape ampersands, angle brackets, quotes, and apostrophes for safe display as text, or decode named and numeric HTML entities without executing the resulting markup.",
    category: "web",
    keywords: ["HTML entities", "escape HTML", "unescape", "encode markup"],
    aliases: ["HTML encoder", "HTML decoder", "entity converter"],
    icon: "code-xml",
    relatedTools: [
      "html-formatter",
      "markdown-previewer",
      "url-encoder-decoder",
    ],
    featured: false,
    searchWeight: 70,
    privacyNote:
      "Entity conversion happens locally and decoded markup is displayed only as text.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Choose Escape or Unescape.",
      "Paste markup, text, or HTML entities.",
      "Convert, then copy or download the text result.",
    ],
    examples: [
      {
        name: "Escape a heading",
        input: "<h1>Tom & Jerry</h1>",
        output: "&lt;h1&gt;Tom &amp; Jerry&lt;/h1&gt;",
      },
    ],
    faqs: [
      {
        question: "Which characters are escaped?",
        answer:
          "The escape mode replaces ampersands, angle brackets, double quotes, and apostrophes, which are the characters that need special handling in common HTML text and attribute contexts.",
      },
      {
        question: "Can unescaped HTML run on this page?",
        answer:
          "No. Unescaped output is rendered in a text panel, not inserted into the document as executable markup.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "HTML Escape and Unescape - Safe Entity Converter",
      description:
        "Escape HTML characters or decode named and numeric entities locally. Results remain plain text and are never executed as page markup.",
    },
    status: "published",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    shortDescription: "Format HTML with readable, consistent indentation.",
    longDescription:
      "Turn compact or uneven HTML into consistently indented markup using a standards-aware formatter that preserves meaningful inline whitespace and reports malformed structures.",
    category: "web",
    keywords: ["HTML formatter", "beautify HTML", "indent markup", "Prettier"],
    aliases: ["HTML beautifier", "pretty HTML", "format markup"],
    icon: "file-code",
    relatedTools: [
      "html-escape-unescape",
      "markdown-previewer",
      "json-formatter",
    ],
    featured: true,
    searchWeight: 82,
    privacyNote:
      "The formatter loads on this route and processes HTML entirely in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Paste HTML into the input editor.",
      "Choose Format HTML and review any parser error.",
      "Copy or download the formatted markup.",
    ],
    examples: [
      {
        name: "Format a compact article",
        input: "<article><h2>News</h2><p>Local tools.</p></article>",
        output: "<article>\n  <h2>News</h2>\n  <p>Local tools.</p>\n</article>",
      },
    ],
    faqs: [
      {
        question: "Does formatting change what the HTML means?",
        answer:
          "The formatter aims to preserve markup semantics and meaningful inline whitespace while normalizing indentation and line wrapping.",
      },
      {
        question: "Is my HTML rendered or executed?",
        answer:
          "No. This tool formats source text and displays source text; it does not mount the HTML as a live page.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "HTML Formatter - Private Online HTML Beautifier",
      description:
        "Format and indent HTML locally with a standards-aware parser. Copy or download readable markup without uploading source code.",
    },
    status: "published",
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    shortDescription: "Render a secure preview from Markdown in your browser.",
    longDescription:
      "Preview headings, lists, links, code, tables, and other common Markdown while sanitizing the generated HTML. Scripts, event handlers, remote images, and unsafe URL schemes are removed.",
    category: "text",
    keywords: ["Markdown", "preview", "GFM", "sanitized HTML"],
    aliases: ["Markdown viewer", "render Markdown", "Markdown to HTML"],
    icon: "file-text",
    relatedTools: [
      "html-formatter",
      "html-escape-unescape",
      "word-character-counter",
    ],
    featured: true,
    searchWeight: 86,
    privacyNote:
      "Markdown parsing and HTML sanitization run locally; remote images are not rendered.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Paste or write Markdown in the editor.",
      "Choose Preview Markdown to load the route-scoped renderer.",
      "Review the sanitized preview or copy its safe HTML.",
    ],
    examples: [
      {
        name: "Preview a task list",
        input: "## Tasks\n\n- **Format** data\n- Keep it `private`",
        output: "A heading and two-item formatted list",
      },
    ],
    faqs: [
      {
        question: "Can Markdown execute scripts?",
        answer:
          "No. Generated HTML passes through an allowlist sanitizer before rendering; scripts, event attributes, embeds, and unsafe links are removed.",
      },
      {
        question: "Why are remote images removed?",
        answer:
          "Loading a remote image can disclose your IP address or trigger tracking. The preview omits images to preserve the local-processing promise.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Markdown Previewer - Sanitized Private Preview",
      description:
        "Preview Markdown locally with sanitized HTML, GFM tables and code. Scripts, unsafe links and remote tracking images are removed.",
    },
    status: "published",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    shortDescription: "Generate placeholder words, sentences, or paragraphs.",
    longDescription:
      "Create a controlled amount of varied placeholder copy for layouts and prototypes. Choose words, sentences, or paragraphs and optionally begin with the familiar Lorem ipsum opening.",
    category: "text",
    keywords: ["Lorem ipsum", "placeholder text", "dummy copy", "generator"],
    aliases: ["dummy text generator", "filler text", "placeholder copy"],
    icon: "text",
    relatedTools: [
      "word-character-counter",
      "text-case-converter",
      "markdown-previewer",
    ],
    featured: false,
    searchWeight: 58,
    privacyNote:
      "Placeholder text is assembled locally using browser randomness.",
    browserProcessing: true,
    sensitive: false,
    inputType: "number",
    outputType: "text",
    usageSteps: [
      "Choose words, sentences, or paragraphs.",
      "Set a count and decide whether to use the classic opening.",
      "Generate, copy, or download the placeholder text.",
    ],
    examples: [
      {
        name: "Generate two paragraphs",
        input: "2 paragraphs; classic opening enabled",
        output: "Two separated paragraphs beginning Lorem ipsum dolor sit amet",
      },
    ],
    faqs: [
      {
        question: "Is the generated text meaningful Latin?",
        answer:
          "No. Lorem ipsum is intentionally nonsensical placeholder copy derived from Latin fragments and should not be treated as real content.",
      },
      {
        question: "Will the result be identical each time?",
        answer:
          "No. Words are selected locally, so repeated generations vary while following the requested structure and limits.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Lorem Ipsum Generator - Words, Sentences or Paragraphs",
      description:
        "Generate a precise number of placeholder words, sentences or paragraphs locally, with an optional classic Lorem ipsum opening.",
    },
    status: "published",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortDescription: "Create and download a QR code entirely in your browser.",
    longDescription:
      "Generate a customizable PNG QR code from text or a URL with selectable size, margin, colors, and error correction. Scan the preview before sharing to confirm the encoded content.",
    category: "image",
    keywords: ["QR code", "generator", "PNG", "error correction"],
    aliases: ["create QR", "URL QR code", "QR image maker"],
    icon: "qr-code",
    relatedTools: [
      "url-encoder-decoder",
      "color-converter",
      "base64-encoder-decoder",
    ],
    featured: true,
    searchWeight: 78,
    privacyNote:
      "QR encoding and PNG generation happen entirely in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "image",
    usageSteps: [
      "Enter the exact text or URL to encode.",
      "Choose size, margin, colors, and error correction.",
      "Generate, scan-check, and download the PNG.",
    ],
    examples: [
      {
        name: "Create a URL QR code",
        input: "https://example.com/tools",
        output: "A locally generated PNG QR code",
      },
    ],
    faqs: [
      {
        question: "Is the QR content uploaded?",
        answer:
          "No. The QR library runs in this browser tab and produces a local data image without contacting a QR service.",
      },
      {
        question: "Which error-correction level should I choose?",
        answer:
          "Medium is a practical default. Higher levels tolerate more damage but make the code denser, so test scanning at the final display size.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "QR Code Generator - Private Local PNG Creator",
      description:
        "Create a customizable QR code PNG entirely in your browser. Set size, colors, margin and error correction without uploading content.",
    },
    status: "published",
  },
  {
    slug: "color-converter",
    name: "Color Converter: HEX, RGB and HSL",
    shortDescription: "Convert HEX, RGB, and HSL colors with optional alpha.",
    longDescription:
      "Enter a color in common HEX, RGB, or HSL syntax and receive normalized values in all three formats. Short hex, alpha channels, hue wrapping, and range validation are supported.",
    category: "color-design",
    keywords: ["color converter", "HEX", "RGB", "HSL"],
    aliases: ["HEX to RGB", "RGB to HSL", "HSL to HEX"],
    icon: "palette",
    relatedTools: [
      "qr-code-generator",
      "text-case-converter",
      "url-encoder-decoder",
    ],
    featured: true,
    searchWeight: 74,
    privacyNote: "Color parsing, conversion, and previewing happen locally.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Enter a HEX, rgb()/rgba(), or hsl()/hsla() value.",
      "Choose Convert color.",
      "Review the preview and copy all normalized formats.",
    ],
    examples: [
      {
        name: "Convert an accent color",
        input: "#6366F1",
        output: "RGB: rgb(99, 102, 241); HSL: hsl(239, 84%, 67%)",
      },
    ],
    faqs: [
      {
        question: "How is alpha represented?",
        answer:
          "Eight-digit HEX uses an alpha byte, while RGBA and HSLA use a decimal from 0 to 1. Opaque output omits alpha for clarity.",
      },
      {
        question: "Can hue values be negative or above 360?",
        answer:
          "Yes. Hue wraps around the color wheel, so equivalent values normalize to a degree from 0 through 359.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "HEX, RGB and HSL Color Converter with Alpha",
      description:
        "Convert HEX, RGB and HSL colors locally with short-hex and alpha support, normalized output, validation and an accessible visual preview.",
    },
    status: "published",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    shortDescription: "Generate SHA hashes with the browser SubtleCrypto API.",
    longDescription:
      "Create SHA-256, SHA-384, SHA-512, or legacy SHA-1 digests from UTF-8 text using native browser cryptography. Choose hexadecimal or Base64 output without storing the source.",
    category: "security",
    keywords: ["hash generator", "SHA-256", "SubtleCrypto", "digest"],
    aliases: ["SHA hash", "text checksum", "SHA-512 generator"],
    icon: "hash",
    relatedTools: [
      "password-generator",
      "jwt-decoder",
      "base64-encoder-decoder",
    ],
    featured: true,
    searchWeight: 80,
    privacyNote:
      "Hash source text stays in memory and is never stored in tool history.",
    browserProcessing: true,
    sensitive: true,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Choose a SHA algorithm and output encoding.",
      "Enter the UTF-8 text to hash.",
      "Generate and copy the digest; the source is not saved.",
    ],
    examples: [
      {
        name: "Hash hello with SHA-256",
        input: "hello",
        output:
          "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
      },
    ],
    faqs: [
      {
        question: "Can a hash be reversed?",
        answer:
          "Cryptographic hashes are designed as one-way fingerprints and normally cannot be reversed. Weak source values can still be guessed and compared.",
      },
      {
        question: "Should I use SHA-1?",
        answer:
          "SHA-1 remains available for compatibility checks, but it is collision-broken and should not be chosen for new security designs. Prefer SHA-256 or stronger.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "SHA Hash Generator - Browser SubtleCrypto Tool",
      description:
        "Generate SHA-256, SHA-384, SHA-512 or SHA-1 hashes locally with SubtleCrypto. Choose hex or Base64 without saving source text.",
    },
    status: "published",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription:
      "Decode JWT header and payload JSON without uploading the token.",
    longDescription:
      "Inspect the Base64URL-encoded header and payload of a three-part JSON Web Token. Decoding reveals claims but does not verify the signature, issuer, audience, expiry, or trustworthiness.",
    category: "developer",
    keywords: ["JWT decoder", "JSON Web Token", "Base64URL", "claims"],
    aliases: ["decode token", "JWT viewer", "inspect JWT"],
    icon: "scan-search",
    relatedTools: [
      "hash-generator",
      "base64-encoder-decoder",
      "json-formatter",
    ],
    featured: false,
    searchWeight: 76,
    privacyNote:
      "JWTs are decoded in memory and are never requested, uploaded, logged, or stored.",
    browserProcessing: true,
    sensitive: true,
    inputType: "text",
    outputType: "structured-data",
    usageSteps: [
      "Paste a three-segment JWT only if you are permitted to inspect it.",
      "Choose Decode JWT.",
      "Treat every displayed claim as unverified data.",
    ],
    examples: [
      {
        name: "Inspect a simple payload",
        input: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature",
        output:
          "Header and payload shown as formatted JSON; signature not verified",
      },
    ],
    faqs: [
      {
        question: "Does decoding verify the JWT signature?",
        answer:
          "No. Decoding only reveals the readable header and payload. A trusted verifier with the correct key and validation policy must authenticate the token.",
      },
      {
        question: "Does PixelUtils save the token?",
        answer:
          "No. The token and decoded claims remain in component memory and are excluded from local tool history and telemetry.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "JWT Decoder - Private Header and Payload Viewer",
      description:
        "Decode JWT header and payload JSON locally without storing the token. Clear warning: decoding does not verify the signature or claims.",
    },
    status: "published",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortDescription: "Solve three common percentage questions clearly.",
    longDescription:
      "Calculate a percentage of a value, determine what percentage one value is of another, or measure percentage change. Each mode uses two clearly labeled inputs and handles zero denominators explicitly.",
    category: "calculators",
    keywords: [
      "percentage calculator",
      "percent of",
      "percentage change",
      "ratio",
    ],
    aliases: ["percent calculator", "what percentage", "percent increase"],
    icon: "percent",
    relatedTools: [
      "age-calculator",
      "unix-timestamp-converter",
      "word-character-counter",
    ],
    featured: false,
    searchWeight: 66,
    privacyNote:
      "Percentage calculations run locally and use only the numbers you enter.",
    browserProcessing: true,
    sensitive: false,
    inputType: "number",
    outputType: "number",
    usageSteps: [
      "Choose one of the three percentage questions.",
      "Enter the two labeled numbers.",
      "Calculate and copy the plain-language result.",
    ],
    examples: [
      {
        name: "Find 15 percent of 240",
        input: "15 and 240",
        output: "15% of 240 is 36.",
      },
    ],
    faqs: [
      {
        question: "Which mode should I use for a discount?",
        answer:
          "Use What is X% of Y to find the discount amount, then subtract that amount from the original price.",
      },
      {
        question: "Why can the starting value not be zero?",
        answer:
          "Percentage change divides by the magnitude of the starting value, so a zero starting point has no finite percentage-change result.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Percentage Calculator - Percent Of, Ratio and Change",
      description:
        "Calculate percent of a value, what percentage one number is of another, or percentage change with clear labels and zero handling.",
    },
    status: "published",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    shortDescription:
      "Calculate calendar age in years, months, days, and total days.",
    longDescription:
      "Compare a birth date with any date using date-only calendar arithmetic. Results are independent of time zones and daylight saving, with an explicit February 29 policy and future-date validation.",
    category: "date-time",
    keywords: ["age calculator", "date of birth", "calendar age", "leap year"],
    aliases: ["how old am I", "DOB calculator", "age on date"],
    icon: "calendar-days",
    relatedTools: [
      "unix-timestamp-converter",
      "percentage-calculator",
      "word-character-counter",
    ],
    featured: false,
    searchWeight: 64,
    privacyNote:
      "Birth and comparison dates are calculated locally and are not stored.",
    browserProcessing: true,
    sensitive: false,
    inputType: "date",
    outputType: "date",
    usageSteps: [
      "Enter a birth date and the date on which to measure age.",
      "Use today if you want the current local calendar date.",
      "Calculate completed years, months, days, and total days.",
    ],
    examples: [
      {
        name: "Leap-day birthday",
        input: "Birth: 2000-02-29; age on: 2025-02-28",
        output: "25 years, 0 months, 0 days",
      },
    ],
    faqs: [
      {
        question: "How are February 29 birthdays handled?",
        answer:
          "In non-leap years, this calculator treats February 28 as the anniversary date. The policy is stated beside the inputs.",
      },
      {
        question: "Can time zones change the result?",
        answer:
          "No. Inputs are parsed as date-only calendar values and compared with UTC day arithmetic, so clock time and daylight-saving transitions are irrelevant.",
      },
    ],
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    seo: {
      title: "Age Calculator - Leap-Year Safe Calendar Age",
      description:
        "Calculate age in years, months, days and total days with date-only arithmetic, future-date validation and a clear leap-day policy.",
    },
    status: "published",
  },
] as const satisfies readonly ToolDefinition[];
