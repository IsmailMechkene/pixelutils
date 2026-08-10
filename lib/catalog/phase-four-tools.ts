import type { ToolDefinition } from "./types";
const date = "2026-08-10";
export const phaseFourTools = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine multiple PDF files locally in your chosen order.",
    longDescription:
      "Merge PDF documents directly in your browser. Reorder files, remove any you do not need, and download one PDF without uploading or rasterizing pages.",
    category: "pdf",
    keywords: ["merge PDF", "combine PDF", "join PDF files"],
    aliases: ["PDF merger", "combine PDFs", "join PDFs"],
    icon: "file-text",
    relatedTools: [],
    featured: true,
    searchWeight: 94,
    privacyNote:
      "Your PDFs are merged locally in your browser and never uploaded.",
    browserProcessing: true,
    sensitive: false,
    inputType: "file",
    outputType: "file",
    usageSteps: [
      "Choose or drop at least two PDF files.",
      "Set the output order by dragging or using the move buttons.",
      "Merge the files and download the new PDF.",
    ],
    examples: [
      {
        name: "Combine two reports",
        input: "January-report.pdf followed by February-report.pdf",
        output: "merged.pdf with January before February",
      },
    ],
    faqs: [
      {
        question: "Are my PDFs uploaded?",
        answer:
          "No. The files stay on your device and are merged in your browser.",
      },
      {
        question: "Does merging reduce page quality?",
        answer:
          "No. This tool copies PDF pages into a new document and does not convert pages to images.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "No. Remove the password or encryption first, then choose the unprotected PDF files.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Merge PDF - Combine PDF Files Locally",
      description:
        "Merge PDF files locally in your browser. Reorder documents, preserve page quality, and download one combined PDF without uploading.",
    },
    status: "published",
  },
  {
    slug: "remove-image-metadata",
    name: "Image Metadata Remover",
    shortDescription: "Create a local image export without copied source metadata.",
    longDescription:
      "Recreate PNG, JPG, JPEG, and supported WebP images locally from decoded pixels. The new export does not copy the original metadata containers, while keeping the displayed image orientation intact.",
    category: "image-conversion",
    keywords: ["remove image metadata", "remove EXIF", "strip image metadata"],
    aliases: ["EXIF remover", "image privacy cleaner", "remove photo data"],
    icon: "image",
    relatedTools: ["image-compressor", "image-cropper", "image-converter"],
    featured: false,
    searchWeight: 88,
    privacyNote:
      "Your image never leaves your device. Processing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose or drop a PNG, JPG, JPEG, or WebP image.",
      "For JPG and WebP, keep the high quality setting or adjust it if needed.",
      "Create the new image, review its size, and download it.",
    ],
    examples: [
      {
        name: "Create a clean JPG export",
        input: "A phone photo JPG selected at quality 92",
        output: "A new JPG export with the displayed orientation preserved",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. The image is decoded and exported locally in your browser, and never leaves your device.",
      },
      {
        question: "Does this guarantee every metadata field is removed?",
        answer:
          "No. The tool creates a new pixel-based export without copying the original metadata containers, but it does not inspect the output or guarantee removal of every possible browser-generated field.",
      },
      {
        question: "Will a phone photo rotate unexpectedly?",
        answer:
          "The local decoder applies the image orientation before export, so the new file keeps the image's displayed orientation in browsers that support the native image pipeline.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Image Metadata Remover - Private Local Re-Export",
      description:
        "Create a new PNG, JPG or WebP image locally without copying original metadata containers. Keep displayed orientation and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortDescription: "Crop PNG, JPG, and WebP images locally.",
    longDescription:
      "Crop PNG, JPG, JPEG, and WebP images entirely in your browser. Move and resize the crop area, choose a common aspect ratio, and download the result without uploading.",
    category: "image-conversion",
    keywords: ["image cropper", "crop image", "crop PNG", "crop JPG"],
    aliases: ["photo cropper", "image cutter", "crop WebP"],
    icon: "image",
    relatedTools: ["image-resizer", "image-converter", "image-compressor"],
    featured: true,
    searchWeight: 91,
    privacyNote:
      "Your image never leaves your device. Processing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose or drop a PNG, JPG, JPEG, or WebP image.",
      "Move or resize the crop area, then choose an aspect ratio if needed.",
      "Crop the image, review the output dimensions, and download it.",
    ],
    examples: [
      {
        name: "Crop a photo for a square profile image",
        input: "A 1600 × 900 JPG cropped with the 1:1 preset",
        output: "A square JPG containing the selected area",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. Cropping happens locally in your browser and your image never leaves your device.",
      },
      {
        question: "Can I crop without a fixed aspect ratio?",
        answer:
          "Yes. Choose Free to move and resize the crop area to any shape, or select a preset such as 1:1 or 16:9.",
      },
      {
        question: "Will PNG or WebP transparency remain?",
        answer:
          "Yes. The cropper keeps the original PNG or WebP format, so transparent pixels remain transparent where the browser supports that format.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Image Cropper - Crop PNG, JPG and WebP Locally",
      description:
        "Crop PNG, JPG and WebP images locally in your browser. Move and resize the crop area, choose an aspect ratio, and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription: "Resize PNG, JPG, and WebP images locally.",
    longDescription:
      "Resize PNG, JPG, JPEG, and WebP images to exact dimensions in your browser. Keep the aspect ratio by default, choose an output format, and download locally.",
    category: "image-conversion",
    keywords: ["image resizer", "resize image", "change image dimensions"],
    aliases: ["resize PNG", "resize JPG", "resize WebP"],
    icon: "image",
    relatedTools: ["image-cropper", "image-converter", "image-compressor"],
    featured: true,
    searchWeight: 91,
    privacyNote:
      "Your image never leaves your device. Processing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose a PNG, JPG, JPEG, or WebP image.",
      "Set the width and height, keeping the aspect ratio locked when appropriate.",
      "Resize, review the output size, and download the result.",
    ],
    examples: [
      {
        name: "Resize a banner without distortion",
        input: "1600 × 900 JPG resized to 800 px wide with aspect ratio locked",
        output: "800 × 450 JPG",
      },
    ],
    faqs: [
      {
        question: "Will this upscale my image?",
        answer:
          "Only if you enter dimensions larger than the original. The tool shows a warning before you resize upward.",
      },
      {
        question: "Can I keep a transparent PNG?",
        answer:
          "Yes. Keep PNG as the output format to retain transparent pixels.",
      },
      {
        question: "Does resizing preserve the aspect ratio?",
        answer:
          "Yes by default. Unlock the aspect-ratio control only when you intentionally need independent width and height.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Image Resizer - Resize PNG, JPG and WebP Locally",
      description:
        "Resize PNG, JPG and WebP images locally in your browser. Set exact dimensions, lock aspect ratio, choose output format and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription: "Convert PNG, JPG, and WebP images locally.",
    longDescription:
      "Convert PNG, JPG, JPEG, and WebP images in your browser with clear output choices, local previews, and no uploads.",
    category: "image-conversion",
    keywords: ["image converter", "png to jpg", "jpg to png", "webp converter"],
    aliases: ["convert image format", "PNG converter", "JPG converter"],
    icon: "image",
    relatedTools: ["image-compressor", "qr-code-generator", "color-converter"],
    featured: true,
    searchWeight: 92,
    privacyNote:
      "Your image never leaves your device. Processing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose or drop a PNG, JPG, JPEG, or WebP image.",
      "Select a supported output format and adjust quality when available.",
      "Convert, review the result, and download the new image.",
    ],
    examples: [
      {
        name: "Convert PNG to JPG",
        input: "A transparent logo PNG with a white background selected",
        output: "A JPG using the same pixel dimensions",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. Conversion happens locally in your browser and your image never leaves your device.",
      },
      {
        question: "What happens to transparency in JPG?",
        answer:
          "JPG cannot preserve transparency. Choose a background color before converting to JPG.",
      },
      {
        question: "Will conversion resize my image?",
        answer: "No. The converter keeps the original pixel dimensions.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Image Converter - PNG, JPG and WebP Online",
      description:
        "Convert PNG, JPG and WebP images locally in your browser. Choose an output format, set lossy quality, and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription: "Compress PNG, JPG, and WebP images locally.",
    longDescription:
      "Reduce JPG and WebP file sizes with a simple quality control, or re-encode transparent PNG files locally without changing image dimensions.",
    category: "image-conversion",
    keywords: ["image compressor", "compress image", "reduce image size"],
    aliases: ["photo compressor", "image size reducer", "compress jpg"],
    icon: "image",
    relatedTools: [
      "qr-code-generator",
      "color-converter",
      "color-contrast-checker",
    ],
    featured: true,
    searchWeight: 91,
    privacyNote:
      "Your image never leaves your device. Processing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose or drop a PNG, JPG, JPEG, or WebP image.",
      "For JPG and WebP, set the quality level you want.",
      "Compress the image, compare the sizes, and download the result.",
    ],
    examples: [
      {
        name: "Compress a JPG photo",
        input: "A 4.2 MB JPG at quality 82",
        output: "A smaller JPG with the same pixel dimensions",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. Image compression runs locally in your browser and your image never leaves your device.",
      },
      {
        question: "Will this resize my image?",
        answer:
          "No. This tool keeps the original pixel dimensions and only re-encodes the image.",
      },
      {
        question: "Does PNG transparency stay intact?",
        answer:
          "Yes. PNG output keeps transparent pixels. PNG compression is lossless, so the new file may not always be smaller.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Image Compressor - Reduce PNG, JPG and WebP Size",
      description:
        "Compress PNG, JPG and WebP images locally in your browser. Adjust JPG and WebP quality, compare file sizes, and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    shortDescription: "Turn titles into clean, readable URL slugs.",
    longDescription:
      "Create lowercase URL slugs from titles and text with Unicode normalization, accent removal, and predictable hyphen separators.",
    category: "text",
    keywords: ["slug generator", "URL slug", "slugify"],
    aliases: ["URL generator", "slug maker"],
    icon: "case-sensitive",
    relatedTools: [
      "text-case-converter",
      "text-cleaner",
      "url-encoder-decoder",
    ],
    featured: false,
    searchWeight: 76,
    privacyNote: "Slug generation runs locally and does not store your text.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "text",
    usageSteps: [
      "Enter a title.",
      "Generate the slug.",
      "Copy it after checking uniqueness.",
    ],
    examples: [
      {
        name: "Create a URL slug",
        input: "Caf\u00e9 & Browser Tools",
        output: "cafe-browser-tools",
      },
    ],
    faqs: [
      {
        question: "Does this guarantee URL uniqueness?",
        answer: "No. Check your site or CMS before publishing a slug.",
      },
      {
        question: "Is my title uploaded?",
        answer: "No. It is transformed in your browser.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Slug Generator - Private URL Slug Maker",
      description:
        "Generate clean URL slugs from text locally with Unicode normalization, accent removal, lowercase output and hyphen separators.",
    },
    status: "published",
  },
  {
    slug: "color-contrast-checker",
    name: "WCAG Color Contrast Checker",
    shortDescription:
      "Check foreground and background colors against WCAG AA contrast.",
    longDescription:
      "Calculate the WCAG contrast ratio for two colors, including alpha compositing over white, and show pass or fail for normal and large text.",
    category: "color-design",
    keywords: ["color contrast", "WCAG contrast", "accessibility colors"],
    aliases: ["contrast checker", "AA color checker"],
    icon: "palette",
    relatedTools: ["color-converter", "text-cleaner", "html-formatter"],
    featured: false,
    searchWeight: 82,
    privacyNote: "Color values are calculated locally in this browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "color",
    outputType: "number",
    usageSteps: [
      "Enter foreground and background colors.",
      "Check the contrast ratio.",
      "Use the stated text-size thresholds.",
    ],
    examples: [
      {
        name: "Check black on white",
        input: "#000000 on #FFFFFF",
        output: "21:1; passes WCAG AA normal text",
      },
    ],
    faqs: [
      {
        question: "What is required for normal text?",
        answer: "WCAG AA requires at least 4.5:1 for normal text.",
      },
      {
        question: "Does alpha affect the result?",
        answer:
          "Yes. Transparent colors are composited before calculating contrast.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "WCAG Color Contrast Checker - AA Ratio Tool",
      description:
        "Check foreground and background color contrast locally against WCAG AA thresholds for normal and large text, including alpha compositing.",
    },
    status: "published",
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    shortDescription:
      "Calculate sale price and savings from a percentage discount.",
    longDescription:
      "Enter an original price and discount percentage to calculate the money saved and final sale price with transparent arithmetic.",
    category: "calculators",
    keywords: ["discount calculator", "sale price", "percent off"],
    aliases: ["percentage discount", "sale calculator"],
    icon: "percent",
    relatedTools: [
      "percentage-calculator",
      "date-difference-calculator",
      "age-calculator",
    ],
    featured: false,
    searchWeight: 74,
    privacyNote: "Calculations run locally with the values you enter.",
    browserProcessing: true,
    sensitive: false,
    inputType: "number",
    outputType: "number",
    usageSteps: [
      "Enter the original price.",
      "Enter a discount from 0 to 100.",
      "Review saving and sale price.",
    ],
    examples: [
      {
        name: "Calculate 25 percent off",
        input: "80 at 25%",
        output: "Saving 20; sale price 60",
      },
    ],
    faqs: [
      {
        question: "Does this include tax?",
        answer:
          "No. It calculates the discount only; add tax separately if needed.",
      },
      {
        question: "Can I use a 100 percent discount?",
        answer: "Yes. The sale price is zero.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Discount Calculator - Sale Price and Savings",
      description:
        "Calculate a percentage discount, money saved and final sale price locally with clear 0 to 100 percent validation.",
    },
    status: "published",
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    shortDescription: "Find the number of calendar days between two dates.",
    longDescription:
      "Compare two date-only values and calculate the absolute number of days between them without time-zone or daylight-saving shifts.",
    category: "date-time",
    keywords: ["date difference", "days between dates", "date calculator"],
    aliases: ["days calculator", "date duration"],
    icon: "calendar-days",
    relatedTools: [
      "age-calculator",
      "unix-timestamp-converter",
      "discount-calculator",
    ],
    featured: false,
    searchWeight: 78,
    privacyNote: "Dates are calculated locally and are not stored.",
    browserProcessing: true,
    sensitive: false,
    inputType: "date",
    outputType: "number",
    usageSteps: [
      "Choose a start and end date.",
      "Calculate the difference.",
      "Read the date-only day total.",
    ],
    examples: [
      {
        name: "Cross a leap day",
        input: "2024-02-28 to 2024-03-01",
        output: "2 days",
      },
    ],
    faqs: [
      {
        question: "Are time zones included?",
        answer:
          "No. This is date-only arithmetic, so time zones and daylight saving do not affect the count.",
      },
      {
        question: "Is the start date included?",
        answer:
          "No. The result is the number of elapsed calendar-day boundaries between the dates.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Date Difference Calculator - Days Between Dates",
      description:
        "Calculate the number of days between two calendar dates locally, including leap days and without time-zone or daylight-saving shifts.",
    },
    status: "published",
  },
] as const satisfies readonly ToolDefinition[];
