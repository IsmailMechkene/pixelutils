import { findTool } from "@/lib/catalog/registry";

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
    relatedGuideSlugs: [
      "json-formatter-vs-json-minifier",
      "convert-csv-to-json-without-uploading",
    ],
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
  {
    slug: "convert-csv-to-json-without-uploading",
    title: "How to convert CSV to JSON without uploading data",
    description:
      "Turn header-based CSV into a readable JSON array locally, handle quoted values correctly, and check the result before you reuse it.",
    summary:
      "Start with a clear, unique header row, preserve quoted cells as text, and validate the generated JSON before it enters an application or workflow.",
    category: "Developer guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    primaryToolSlug: "csv-to-json-converter",
    relatedToolSlugs: [
      "json-formatter",
      "yaml-formatter-validator",
      "xml-formatter-validator",
    ],
    relatedGuideSlugs: [
      "format-and-validate-json-safely",
      "json-formatter-vs-json-minifier",
    ],
    sections: [
      {
        id: "start-with-a-header-row",
        heading: "Start with one clear header row",
        paragraphs: [
          "A CSV-to-JSON conversion needs column names because those names become property keys in every JSON object. Put the headers in the first row, keep them non-empty, and make each one unique before converting.",
          "For example, the headers `name,email` produce objects with `name` and `email` keys. If two columns use the same name, there is no unambiguous way to represent both values as properties in one object, so fix the source header first.",
        ],
        codeExample: {
          label: "A header-based CSV becomes an array of objects",
          language: "csv / json",
          value:
            'name,role\\nAda,Engineer\\nLin,Designer\\n\\nbecomes\\n\\n[\\n  {\\n    "name": "Ada",\\n    "role": "Engineer"\\n  },\\n  {\\n    "name": "Lin",\\n    "role": "Designer"\\n  }\\n]',
        },
      },
      {
        id: "keep-quoted-cells-intact",
        heading: "Keep commas and quotes inside quoted cells intact",
        paragraphs: [
          "A comma normally separates CSV cells, but a comma inside a quoted cell belongs to the value. For example, `\"Paris, France\"` is one location value, not two columns. A double quote inside a quoted cell is written as two double quotes, such as `\"She said \"\"hello\"\"\"`.",
          "Check the row shape if conversion reports a different number of values from the header. That usually means a missing comma, a stray quote, or a quoted value that has not been closed—not a JSON problem.",
        ],
      },
      {
        id: "understand-json-value-types",
        heading: "Understand how CSV values become JSON",
        paragraphs: [
          "CSV does not have built-in number, boolean, date, or null types. The converter preserves each CSV cell as text, so `42`, `true`, and `2026-08-24` become JSON strings unless you deliberately transform them in a later step.",
          "This is usually safer for an initial conversion because it avoids guessing what a value means. If your destination requires typed fields, document the conversion rules—for example, which empty values become null and which columns must be numbers—then validate the result against that destination's requirements.",
        ],
      },
      {
        id: "convert-locally-and-validate-output",
        heading: "Convert locally, then validate the output",
        paragraphs: [
          "Paste the CSV into the CSV to JSON Converter, create the JSON array, and inspect the first and last objects before copying or downloading it. PixelUtils performs the parsing and JSON creation in the browser, which avoids sending pasted data to a conversion server.",
          "Use the JSON Formatter to check the final structure if you edit the output or need to investigate an error. Local processing does not change your responsibility to handle sensitive exports carefully after you copy, download, or share them.",
        ],
        steps: [
          "Confirm that the first CSV row contains unique, meaningful headers.",
          "Check quoted cells for commas or double quotes that must stay within one value.",
          "Convert the CSV and inspect a few generated objects.",
          "Format and validate the JSON before importing it into another system.",
        ],
      },
    ],
  },
  {
    slug: "reduce-image-file-size-without-losing-quality",
    title: "How to compress an image for email without uploading it",
    description:
      "Make an image small enough for email by reducing dimensions, choosing a suitable format, and exporting locally in your browser.",
    summary:
      "For an email attachment, reduce dimensions before quality, compare the result at normal viewing size, and keep the original separate.",
    category: "Image guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-23",
    primaryToolSlug: "image-compressor",
    relatedToolSlugs: ["image-resizer", "image-converter", "png-to-webp"],
    relatedGuideSlugs: [
      "png-vs-jpg-vs-webp",
      "resize-image-for-the-web-without-distortion",
    ],
    sections: [
      {
        id: "choose-an-email-target",
        heading: "Choose an email-appropriate target first",
        paragraphs: [
          "Email providers and recipients can impose different attachment limits, and a large attachment can be inconvenient even when it is accepted. Aim for the smallest version that still lets the recipient read or view what matters.",
          "Decide the largest display size, whether the image needs transparency, and whether the recipient requires a particular format. Those constraints make the export choice clearer than chasing a single file-size number.",
        ],
      },
      {
        id: "reduce-pixels-first",
        heading: "Resize before lowering image quality",
        paragraphs: [
          "Pixel dimensions often affect file size more than a small quality adjustment. An image that is 4000 pixels wide carries far more visual data than a 1600-pixel version, even when both look similar in an email preview.",
          "Resize a copy to the largest dimensions the recipient needs. Keep the original separately so you can make a different export later without repeatedly compressing an already compressed file.",
        ],
        steps: [
          "Open the image in the Image Resizer and enter the maximum width or height you actually need.",
          "Keep the aspect ratio locked unless you intend to change the composition.",
          "Export the resized copy, then use compression only if its file size still needs to be lower.",
        ],
      },
      {
        id: "choose-a-format-and-quality",
        heading: "Choose a suitable format, then use the lowest acceptable quality",
        paragraphs: [
          "JPG and WebP are lossy formats that trade some detail for a smaller file. PNG is often better when transparency or crisp screenshot text matters, but it can be larger. The best choice depends on the image and what the recipient can open.",
          "Compare the compressed export at the size people will actually see. Check sharp edges, readable text, faces, and smooth colour areas. If you notice artifacts, use a higher-quality setting or reduce the dimensions less aggressively.",
        ],
      },
      {
        id: "export-locally-and-check",
        heading: "Export locally and check the attachment copy",
        paragraphs: [
          "PixelUtils compresses the selected image in your browser, so you can create the email copy without sending the image to a processing server. Download the result, open it once, and check both its file size and the details that need to remain legible.",
          "Each lossy re-export can discard more detail. Work from the original whenever possible, and make separate exports for different destinations instead of compressing yesterday's compressed version again.",
        ],
      },
    ],
  },
  {
    slug: "resize-image-for-the-web-without-distortion",
    title: "How to resize an image for the web without distortion",
    description:
      "Resize an image to the dimensions your page needs, preserve its aspect ratio, and avoid unnecessary quality loss or oversized downloads.",
    summary:
      "Start with the largest display size the image needs, scale down rather than up where possible, keep proportions locked, and choose an export format for the destination.",
    category: "Image guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    primaryToolSlug: "image-resizer",
    relatedToolSlugs: ["image-compressor", "image-converter", "image-cropper"],
    relatedGuideSlugs: [
      "reduce-image-file-size-without-losing-quality",
      "png-vs-jpg-vs-webp",
    ],
    sections: [
      {
        id: "choose-the-display-size",
        heading: "Choose the largest display size your page needs",
        paragraphs: [
          "Start with the image's actual role on the page. A thumbnail, card image, article image, and full-width banner do not need the same pixel dimensions. Exporting an image close to its largest intended display size avoids asking visitors to download far more pixels than they can see.",
          "Do not rely on a single fixed size for every screen. Your site layout can make an image responsive, while the source image should still be large enough for its largest useful display. Keep the original so you can make another export for a different placement later.",
        ],
      },
      {
        id: "preserve-the-aspect-ratio",
        heading: "Keep the aspect ratio locked to avoid distortion",
        paragraphs: [
          "An image's aspect ratio is the relationship between its width and height. When you change only one dimension with the ratio locked, the other dimension adjusts automatically. This keeps circles round and prevents people, products, or logos from looking stretched.",
          "Unlock the ratio only when you deliberately need exact independent dimensions. If the image must fit a different shape, cropping is often a better choice than squeezing it into that shape because a crop removes unwanted edges instead of distorting every pixel.",
        ],
        steps: [
          "Find the maximum width or height the image needs in its destination layout.",
          "Open the image in the Image Resizer and keep the aspect ratio locked.",
          "Enter the one dimension you need, then review the automatically calculated other dimension.",
          "Download the resized copy and compare it at the size visitors will see.",
        ],
      },
      {
        id: "scale-down-before-upscaling",
        heading: "Scale down before you consider upscaling",
        paragraphs: [
          "Making an image smaller usually gives the browser fewer pixels to represent, which is useful for web delivery and can still look sharp at the smaller display size. Making it substantially larger cannot create missing original detail and can make blur or compression artifacts more visible.",
          "If an image is too small for its intended space, use a better source image when possible. PixelUtils warns before an upward resize, so you can decide whether a modest enlargement is acceptable rather than treating it as a quality upgrade.",
        ],
      },
      {
        id: "choose-format-and-review-export",
        heading: "Choose an export format and review the result",
        paragraphs: [
          "Resizing and compression are related but separate choices. Resize first to remove unneeded pixels, then use compression only if the resized file is still larger than the destination needs. Repeatedly exporting a lossy JPG or WebP can gradually discard detail, so begin each new version from the original whenever possible.",
          "Keep PNG when transparency or crisp graphic edges are important. Use JPG for broadly compatible photographs, or WebP where the receiving website supports it and a smaller export is useful. PixelUtils processes supported image resizing locally in the browser, so the selected image is not sent to a processing server.",
        ],
      },
    ],
  },
  {
    slug: "remove-image-metadata-before-sharing",
    title: "How to remove image metadata before sharing",
    description:
      "Create a local image export without copying original metadata containers, then review what that new file can and cannot guarantee.",
    summary:
      "A new pixel-based export can omit copied source metadata containers. It is useful before sharing, but it cannot guarantee the removal of every possible field.",
    category: "Image guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    primaryToolSlug: "remove-image-metadata",
    relatedToolSlugs: ["image-metadata-viewer", "image-compressor", "image-resizer"],
    relatedGuideSlugs: [
      "reduce-image-file-size-without-losing-quality",
      "png-vs-jpg-vs-webp",
    ],
    sections: [
      {
        id: "check-what-you-are-sharing",
        heading: "Check what the image may contain before you share it",
        paragraphs: [
          "An image file can include more than visible pixels. Depending on its format and source, readable metadata may describe the camera, capture date, orientation, location, or editing details. Not every image has all of these fields.",
          "Use the Image Metadata Viewer to inspect the readable fields in a copy before deciding what to share. Metadata is only one part of privacy: the visible image itself, its filename, and the place where you publish it can also reveal information.",
        ],
      },
      {
        id: "create-a-new-local-export",
        heading: "Create a new local export instead of editing the original",
        paragraphs: [
          "The Image Metadata Remover decodes a supported PNG, JPG, JPEG, or WebP image in your browser and creates a new pixel-based export. It does not copy the original metadata containers into that new file.",
          "Keep the original image unchanged and treat the download as a separate sharing copy. This gives you a source file if you later need a different format, a higher-quality export, or the original metadata for your own records.",
        ],
        steps: [
          "Choose a copy of the image you are allowed to share.",
          "For JPG or WebP, keep the high-quality setting unless you intentionally want a smaller file.",
          "Create the new image, download it, and keep it separate from the original.",
          "Open the downloaded copy and confirm that its visible orientation and content are right for the recipient.",
        ],
      },
      {
        id: "understand-the-limits",
        heading: "Understand what metadata removal does not prove",
        paragraphs: [
          "A new export without copied source metadata containers is not a guarantee that every possible field is absent. Browser-generated fields and format-specific details can vary, so do not treat a metadata-removal export as proof that a file meets a legal, contractual, or safety requirement.",
          "Removing metadata also cannot remove information visible in the pixels, such as an address on a sign, a recognizable person, or a location in the background. Review the whole image and consider the sharing channel before sending it.",
        ],
      },
      {
        id: "separate-file-size-from-privacy",
        heading: "Handle file size as a separate choice",
        paragraphs: [
          "Re-exporting an image can change its file size, but metadata removal is not a substitute for intentional compression. If an attachment also needs to be smaller, resize the new copy first and then use the Image Compressor with a quality level you have reviewed.",
          "Choose the output format for the recipient's needs. JPG is broadly compatible for photos, while PNG or WebP can be better for certain images and destinations. Keep the original until you know the sharing copy is suitable.",
        ],
      },
    ],
  },
  {
    slug: "png-vs-jpg-vs-webp",
    title: "PNG vs JPG vs WebP: which image format should you use?",
    description:
      "Choose PNG, JPG, or WebP based on transparency, image content, file size, and compatibility instead of relying on a single format for every image.",
    summary:
      "PNG is best when you need transparency or crisp graphics, JPG is widely compatible for photographs, and WebP often makes smaller web exports when the receiving service supports it.",
    category: "Image guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    primaryToolSlug: "image-converter",
    relatedToolSlugs: ["png-to-jpg", "png-to-webp", "jpg-to-png"],
    relatedGuideSlugs: ["reduce-image-file-size-without-losing-quality"],
    sections: [
      {
        id: "the-short-answer",
        heading: "The short answer",
        paragraphs: [
          "Choose PNG for transparent logos, icons, screenshots with sharp text, and graphics that need exact edges. Choose JPG for photographs when broad compatibility matters. Choose WebP for web images when you want a smaller modern export and the destination accepts it.",
          "There is no quality upgrade hidden in conversion. Changing a JPG into PNG does not restore detail that JPG compression already removed; it only creates a new file in a different container.",
        ],
      },
      {
        id: "when-png-is-right",
        heading: "Use PNG for transparency and crisp graphics",
        paragraphs: [
          "PNG supports transparent pixels, making it a good choice for logos placed over different backgrounds. It also handles hard edges, flat colours, and screenshot text well without the blocky artifacts that can appear in lossy formats.",
          "Its tradeoff is size. A detailed photo stored as PNG can be much larger than a visually similar JPG or WebP, so PNG is rarely the efficient default for camera images.",
        ],
      },
      {
        id: "when-jpg-is-right",
        heading: "Use JPG when compatibility matters for photos",
        paragraphs: [
          "JPG is accepted by almost every service, app, and device. It is a reliable choice for a photograph that will be shared, uploaded, or attached where you cannot control the recipient's software.",
          "JPG does not preserve transparency. Transparent areas must be placed on a solid background during export, so use PNG or WebP when the alpha channel is important.",
        ],
      },
      {
        id: "when-webp-is-right",
        heading: "Use WebP for smaller web-ready exports",
        paragraphs: [
          "WebP can support transparency and often reaches a lower file size than older formats for comparable web use. It is useful when you control the website or platform and have confirmed that it accepts WebP uploads.",
          "Keep a compatible JPG or PNG source when sending files to an unknown system. Conversion should serve a concrete destination, not replace your only original copy.",
        ],
      },
    ],
  },
  {
    slug: "how-to-merge-pdf-files-in-order",
    title: "How to merge PDF files without uploading them",
    description:
      "Combine PDF files in a chosen order directly in your browser, then verify the downloaded document before sharing it.",
    summary:
      "Choose authorized files, set their order, create a new local download, and check the result without sending PDFs to a processing server.",
    category: "PDF guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-23",
    primaryToolSlug: "merge-pdf",
    relatedToolSlugs: ["split-pdf", "pdf-to-images", "images-to-pdf"],
    relatedGuideSlugs: ["how-to-split-pdf-pages"],
    sections: [
      {
        id: "what-without-upload-means",
        heading: "What merging without uploading means",
        paragraphs: [
          "A browser-based PDF merger can create the finished file on your device instead of sending the selected documents to a processing server. PixelUtils merges selected PDFs locally in the browser, so the documents stay on your device during the merge.",
          "The page still needs to load in your browser, and you remain responsible for how the downloaded document is stored or shared. Use files you are authorized to combine and keep the originals until you have checked the result.",
        ],
      },
      {
        id: "prepare-authorized-files",
        heading: "Prepare authorized, readable PDF files",
        paragraphs: [
          "Name or group the documents so their intended order is obvious. A cover page, a main document, and appendices are easier to arrange when you decide the sequence before opening the tool.",
          "If a PDF is password protected, corrupted, or cannot be read, resolve that issue with an authorized unprotected copy first. A merger should not be used to bypass document permissions.",
        ],
      },
      {
        id: "set-and-check-order",
        heading: "Set the order before you create the merged file",
        paragraphs: [
          "Add all files, then inspect their order carefully. The output follows that order, so move an appendix or cover document before generating the final PDF rather than trying to correct it afterward.",
          "For a large pack, keep a clear source copy of each original document. If you need to change one section later, you can create a new merge from the originals instead of altering the finished file.",
        ],
        steps: [
          "Choose the PDFs you are authorized to combine.",
          "Arrange them from first page to last page.",
          "Create the merged PDF and download it locally.",
          "Open the downloaded file and confirm the transitions between documents.",
        ],
      },
      {
        id: "download-and-verify",
        heading: "Download and verify the new document",
        paragraphs: [
          "Open the merged PDF and review the first page, the last page, and every point where one source document joins the next. This quickly catches a missing file or an accidental ordering mistake.",
          "PixelUtils copies PDF pages into a new document rather than converting them to images. You should still open the finished PDF in the viewer your recipient will use, especially when the source contains forms, signatures, or complex layouts.",
        ],
      },
    ],
  },
  {
    slug: "rotate-pdf-pages-without-uploading",
    title: "How to rotate PDF pages without uploading them",
    description:
      "Fix sideways PDF pages in 90-degree steps, keep the original document, and create a new local download in your browser.",
    summary:
      "Rotate only the pages that need correction, check their reading order, and download a separate PDF without sending the document to a processing server.",
    category: "PDF guide",
    readingTime: "4 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    primaryToolSlug: "pdf-reorder-rotate-pages",
    relatedToolSlugs: ["merge-pdf", "split-pdf", "pdf-to-images"],
    relatedGuideSlugs: [
      "how-to-merge-pdf-files-in-order",
      "how-to-split-pdf-pages",
    ],
    sections: [
      {
        id: "decide-which-pages-need-rotation",
        heading: "Decide which pages need to turn",
        paragraphs: [
          "A sideways scan does not always mean that every page is wrong. Open the original PDF first and note the exact page positions that need attention. This avoids rotating a cover, landscape diagram, or already-correct page by mistake.",
          "PDF page rotation is normally done in 90-degree steps. It is suitable for a page that was scanned or exported sideways, but it cannot straighten a page that is only slightly tilted. Keep the original until the replacement file has been checked.",
        ],
      },
      {
        id: "rotate-pages-in-a-local-copy",
        heading: "Rotate the required pages in a local copy",
        paragraphs: [
          "PixelUtils lets you rotate individual pages and arrange their order in the browser. The selected PDF stays on your device while you work, and the saved result is a separate PDF rather than a change to the source file.",
          "Use one 90-degree turn at a time, then check the page thumbnail or preview before moving on. A page can need two turns for a 180-degree correction, while a landscape page may already be intended to display sideways.",
        ],
        steps: [
          "Choose the PDF file you are authorized to edit.",
          "Identify the page or pages that are not in their intended reading orientation.",
          "Rotate each affected page in 90-degree steps and review the result.",
          "Save the new PDF and download it separately from the original.",
        ],
      },
      {
        id: "check-reading-order-and-content",
        heading: "Check reading order and content before sharing",
        paragraphs: [
          "Open the downloaded file in a PDF viewer and inspect the corrected pages at normal size. Confirm that text, tables, signatures, and diagrams can be read in the intended direction, particularly where pages switch between portrait and landscape layouts.",
          "If you also need to move a page, set the order before saving the new file. Rotating a page changes its display orientation; it does not decide where that page belongs in the document.",
        ],
      },
      {
        id: "know-when-rotation-is-not-enough",
        heading: "Know when rotation is not enough",
        paragraphs: [
          "Page rotation will not repair a skewed scan, missing content, a corrupt PDF, or a password-protected document you are not authorized to edit. Resolve those issues with an appropriate authorized workflow instead of trying to force a page-rotation tool to bypass a restriction.",
          "For confidential documents, consider where processing occurs before choosing a service. PixelUtils handles page rotation locally in the browser, but you are still responsible for storing and sharing the downloaded copy safely.",
        ],
      },
    ],
  },
  {
    slug: "how-to-split-pdf-pages",
    title: "How to split PDF pages safely",
    description:
      "Split a PDF into individual pages or selected page ranges, verify the output, and keep the original document intact.",
    summary:
      "Decide whether you need every page separately or only a selected range, then verify the page numbers before creating new PDFs. Splitting creates copies; it does not alter the original file.",
    category: "PDF guide",
    readingTime: "4 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    primaryToolSlug: "split-pdf",
    relatedToolSlugs: ["merge-pdf", "pdf-to-images", "images-to-pdf"],
    relatedGuideSlugs: [
      "how-to-merge-pdf-files-in-order",
      "rotate-pdf-pages-without-uploading",
    ],
    sections: [
      {
        id: "choose-the-split-type",
        heading: "Choose between individual pages and page ranges",
        paragraphs: [
          "Split into individual pages when each page needs to be sent or reviewed separately. Extract a page range when you need one section, such as pages 4 through 9, to remain together in a new PDF.",
          "Write down the page numbers before you start, especially when a PDF has a printed page number that differs from the viewer's page count because of covers or inserts.",
        ],
      },
      {
        id: "confirm-page-numbers",
        heading: "Confirm the pages before creating output",
        paragraphs: [
          "Preview or count the document pages, then enter the exact selection. A small off-by-one mistake can remove a signature page, a supporting table, or the first page of a section.",
          "Keep the source PDF unchanged. Splitting should create new files while leaving the original available for comparison or a revised selection.",
        ],
        steps: [
          "Choose the PDF and wait for its page count to be read.",
          "Select individual pages or enter the range you need.",
          "Create the new PDF files and download each result.",
          "Open a result to confirm its first and last pages before sharing it.",
        ],
      },
      {
        id: "name-outputs-clearly",
        heading: "Name outputs so they remain understandable",
        paragraphs: [
          "A meaningful filename helps when several extracted pages are downloaded at once. Add a page range or a short section name after download if the default name will not be clear to the recipient.",
          "Avoid replacing the original PDF with an extracted copy. Keeping both prevents confusion when someone later asks for a page that was not included in the selected range.",
        ],
      },
      {
        id: "consider-the-document",
        heading: "Consider the document before you split it",
        paragraphs: [
          "Some documents should remain complete for legal, operational, or contextual reasons. Confirm that extracting a section is appropriate before sending it independently of the rest of the file.",
          "For confidential files, use a workflow that is clear about where processing happens. PixelUtils performs the page work in the browser rather than sending the PDF to a processing server.",
        ],
      },
    ],
  },
  {
    slug: "mkv-vs-mp4-compatibility-and-conversion",
    title: "MKV vs MP4: compatibility and conversion choices",
    description:
      "Understand the difference between MKV and MP4 containers, when remuxing is enough, and when video re-encoding is necessary for compatibility.",
    summary:
      "MKV and MP4 are containers, not guarantees about the audio or video inside. A fast conversion can copy compatible streams, while incompatible codecs require slower re-encoding.",
    category: "Video guide",
    readingTime: "5 min read",
    byline: "PixelUtils editorial team",
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    primaryToolSlug: "mkv-to-mp4",
    relatedToolSlugs: ["video-compressor"],
    relatedGuideSlugs: [],
    sections: [
      {
        id: "containers-and-codecs",
        heading: "MKV and MP4 are containers, not codecs",
        paragraphs: [
          "A container is the file wrapper that holds video, audio, subtitles, chapters, and metadata. The codec is the method used to encode each audio or video stream inside that wrapper.",
          "That distinction explains why changing a file extension is not a real conversion. A player may support MP4 files but still reject an MP4 that contains an unsupported stream.",
        ],
      },
      {
        id: "when-stream-copy-works",
        heading: "Use stream copy when the tracks are already compatible",
        paragraphs: [
          "If the existing video and audio streams are valid in an MP4 container, a tool can remux them: it writes the same streams into a new wrapper without re-encoding. This is usually much faster and avoids a second lossy video encode.",
          "Compatibility depends on the exact tracks, not just the MKV filename. A conversion tool should inspect the file first and explain whether direct stream copy is possible.",
        ],
      },
      {
        id: "when-reencoding-is-needed",
        heading: "Re-encode only when compatibility requires it",
        paragraphs: [
          "When a stream cannot be placed in a broadly compatible MP4 file, re-encoding creates a new stream in a supported codec. It takes longer, uses more device resources, and can change output size or visual quality.",
          "Keep the original MKV until the MP4 plays correctly in the target device or service. The original may preserve subtitle tracks, chapters, or formats that a compatible MP4 export does not carry over.",
        ],
      },
      {
        id: "choose-the-right-workflow",
        heading: "Choose the right workflow for the destination",
        paragraphs: [
          "For a file that only needs a more widely accepted container, try compatibility-preserving conversion first. For a file that needs to be smaller, use compression after confirming the output format and resolution you need.",
          "Video work can require substantial memory and time in a browser. Keep the tab open during processing and choose a smaller source or a desktop device when a large file cannot complete reliably.",
        ],
        steps: [
          "Choose the MKV file and review the compatibility result.",
          "Create an MP4 with stream copy when the tracks are compatible.",
          "Use re-encoding only when the tool reports that it is required.",
          "Download and play the MP4 in the device or service that needs it.",
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

export function getGuidesForTool(toolSlug: string) {
  return publishedGuides.filter(
    (guide) =>
      guide.primaryToolSlug === toolSlug || guide.relatedToolSlugs.includes(toolSlug),
  );
}

export function getGuidesForCategory(categorySlug: string) {
  return publishedGuides.filter(
    (guide) => findTool(guide.primaryToolSlug)?.category === categorySlug,
  );
}
