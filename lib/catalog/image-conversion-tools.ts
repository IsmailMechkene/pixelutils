import type { ToolDefinition } from "./types";

const date = "2026-08-10";
const localPrivacy =
  "Your image never leaves your device. Processing happens locally in your browser.";

export const imageConversionTools = [
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    shortDescription: "Turn PNG images into smaller JPG files locally.",
    longDescription:
      "Convert PNG images to JPG when you need broad compatibility or a smaller photographic file. Choose the background color used where the PNG is transparent.",
    category: "image",
    keywords: ["PNG to JPG", "convert PNG to JPG", "PNG to JPEG"],
    aliases: ["PNG to JPEG", "convert PNG image"],
    icon: "image",
    relatedTools: ["image-converter", "png-to-webp", "image-compressor"],
    featured: false,
    searchWeight: 90,
    privacyNote: localPrivacy,
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a PNG image.",
      "Set the JPG background color for transparent areas.",
      "Convert and download the JPG.",
    ],
    examples: [
      {
        name: "Flatten a transparent logo",
        input: "Transparent PNG with a white background",
        output: "A JPG with the same dimensions and white background",
      },
    ],
    faqs: [
      {
        question: "Will a JPG keep PNG transparency?",
        answer:
          "No. JPG does not support transparent pixels, so this converter fills them with your selected background color.",
      },
      {
        question: "Is PNG to JPG good for photographs?",
        answer:
          "Often, yes. JPG is designed for photographic images and can produce a smaller file at an appropriate quality setting.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "PNG to JPG Converter - Convert PNG Images Locally",
      description:
        "Convert PNG to JPG in your browser with a background color for transparent areas. Preview, choose quality, and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    shortDescription: "Convert JPG photos to lossless PNG files locally.",
    longDescription:
      "Convert a JPG or JPEG image to PNG when you need lossless PNG output for a workflow, annotation, or further editing. The conversion keeps the original dimensions.",
    category: "image",
    keywords: ["JPG to PNG", "JPEG to PNG", "convert JPG to PNG"],
    aliases: ["JPEG to PNG converter", "convert JPEG image"],
    icon: "image",
    relatedTools: ["image-converter", "jpg-to-webp", "image-compressor"],
    featured: false,
    searchWeight: 88,
    privacyNote: localPrivacy,
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a JPG or JPEG image.",
      "Convert it to PNG.",
      "Review the unchanged dimensions and download the PNG.",
    ],
    examples: [
      {
        name: "Prepare a photo for a PNG-only workflow",
        input: "JPG photo",
        output: "PNG with the same pixel dimensions",
      },
    ],
    faqs: [
      {
        question: "Will JPG to PNG improve the original quality?",
        answer:
          "No. PNG cannot restore detail already lost in a JPG, but it avoids adding another lossy JPG encode.",
      },
      {
        question: "Will the PNG be smaller?",
        answer:
          "Not usually for photographs. PNG is lossless and may be larger than the original JPG.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "JPG to PNG Converter - Local JPEG to PNG Conversion",
      description:
        "Convert JPG or JPEG images to PNG locally in your browser. Keep dimensions unchanged and download without uploading your photo.",
    },
    status: "published",
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP Converter",
    shortDescription: "Convert PNG images to modern WebP files locally.",
    longDescription:
      "Convert PNG to WebP for a modern web image format that can keep transparent pixels while often reducing transfer size. Adjust the quality before converting.",
    category: "image",
    keywords: ["PNG to WebP", "convert PNG to WebP", "WebP converter"],
    aliases: ["PNG WebP converter", "convert transparent PNG"],
    icon: "image",
    relatedTools: ["image-converter", "png-to-jpg", "image-compressor"],
    featured: false,
    searchWeight: 86,
    privacyNote: localPrivacy,
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a PNG image.",
      "Set WebP quality.",
      "Convert and download the WebP image.",
    ],
    examples: [
      {
        name: "Convert a transparent UI graphic",
        input: "Transparent PNG",
        output: "WebP that keeps transparent pixels",
      },
    ],
    faqs: [
      {
        question: "Does WebP preserve PNG transparency?",
        answer:
          "Yes. WebP supports transparent pixels, so transparency is retained when the browser encoder supports the selected output.",
      },
      {
        question: "Why use WebP instead of PNG?",
        answer:
          "WebP can be more efficient for many web images while retaining transparency, although the best choice depends on the image and audience.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "PNG to WebP Converter - Convert Transparent PNG Locally",
      description:
        "Convert PNG to WebP locally in your browser. Keep transparent pixels, choose quality, preview the result, and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP Converter",
    shortDescription: "Convert JPG photos to efficient WebP images locally.",
    longDescription:
      "Convert JPG or JPEG images to WebP for a modern web format with a straightforward quality control. Dimensions stay the same and the image remains on your device.",
    category: "image",
    keywords: ["JPG to WebP", "JPEG to WebP", "convert JPG to WebP"],
    aliases: ["JPEG WebP converter", "photo to WebP"],
    icon: "image",
    relatedTools: ["image-converter", "jpg-to-png", "image-compressor"],
    featured: false,
    searchWeight: 87,
    privacyNote: localPrivacy,
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a JPG or JPEG image.",
      "Set the WebP quality.",
      "Convert and download the WebP output.",
    ],
    examples: [
      {
        name: "Prepare a photo for the web",
        input: "JPG photograph",
        output: "WebP with the same dimensions",
      },
    ],
    faqs: [
      {
        question: "Does JPG to WebP resize the image?",
        answer: "No. This converter preserves the original pixel dimensions.",
      },
      {
        question: "Which quality should I choose?",
        answer:
          "Start near the default, compare the preview and file size, then lower quality only when the visual result remains suitable.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "JPG to WebP Converter - Local JPEG to WebP Tool",
      description:
        "Convert JPG or JPEG images to WebP locally in your browser. Set quality, preserve dimensions, preview, and download without uploads.",
    },
    status: "published",
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG Converter",
    shortDescription:
      "Convert WebP images to transparent-capable PNG files locally.",
    longDescription:
      "Convert WebP to PNG when a tool or workflow needs PNG. PNG supports transparency and provides lossless output, though photographic files may become larger.",
    category: "image",
    keywords: ["WebP to PNG", "convert WebP to PNG", "WebP converter"],
    aliases: ["WebP PNG converter", "download WebP as PNG"],
    icon: "image",
    relatedTools: ["image-converter", "webp-to-jpg", "image-compressor"],
    featured: false,
    searchWeight: 86,
    privacyNote: localPrivacy,
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a WebP image.",
      "Convert it to PNG.",
      "Download the PNG with the original dimensions.",
    ],
    examples: [
      {
        name: "Use a WebP image in a PNG-only editor",
        input: "WebP image",
        output: "PNG with the same dimensions",
      },
    ],
    faqs: [
      {
        question: "Will WebP transparency be kept in PNG?",
        answer:
          "Yes. PNG supports transparent pixels, so they are retained in the converted image.",
      },
      {
        question: "Will the PNG be smaller than WebP?",
        answer:
          "It may be larger. PNG is lossless, while WebP is often optimized for smaller web delivery.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "WebP to PNG Converter - Local WebP Image Conversion",
      description:
        "Convert WebP to PNG locally in your browser. Preserve transparency, keep dimensions unchanged, preview and download without uploads.",
    },
    status: "published",
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    shortDescription: "Convert WebP images to compatible JPG files locally.",
    longDescription:
      "Convert WebP to JPG when you need a widely supported format for sharing or an older workflow. Pick the background color that replaces any transparent areas.",
    category: "image",
    keywords: ["WebP to JPG", "WebP to JPEG", "convert WebP to JPG"],
    aliases: ["WebP JPEG converter", "convert WebP image"],
    icon: "image",
    relatedTools: ["image-converter", "webp-to-png", "image-compressor"],
    featured: false,
    searchWeight: 87,
    privacyNote: localPrivacy,
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a WebP image.",
      "Choose a JPG background color if transparency is present.",
      "Convert and download the JPG.",
    ],
    examples: [
      {
        name: "Share a WebP image with a JPG-only workflow",
        input: "WebP image with a white background selected",
        output: "JPG with the same dimensions",
      },
    ],
    faqs: [
      {
        question: "What happens to transparent WebP pixels?",
        answer:
          "JPG cannot store transparency, so the converter fills those areas with your selected background color.",
      },
      {
        question: "Does this make the image more compatible?",
        answer:
          "JPG is supported by a wider range of older software and services, but WebP is generally more efficient for modern web delivery.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "WebP to JPG Converter - Convert WebP Images Locally",
      description:
        "Convert WebP to JPG locally in your browser. Select a background for transparent pixels, preview the result, and download without uploading.",
    },
    status: "published",
  },
] as const satisfies readonly ToolDefinition[];
