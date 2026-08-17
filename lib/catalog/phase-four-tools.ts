import type { ToolDefinition } from "./types";
const date = "2026-08-10";
export const phaseFourTools = [
  {
    slug: "url-parser-query-editor",
    name: "URL Parser and Query String Editor",
    shortDescription:
      "Parse URLs and edit query parameters locally in your browser.",
    longDescription:
      "Break down a full URL into its protocol, host, path, fragment, and query parameters. Edit, add, remove, or reorder query values, then rebuild a correctly encoded URL without uploading it.",
    category: "web",
    keywords: [
      "URL parser",
      "query string editor",
      "URL query parameters",
      "parse URL",
    ],
    aliases: [
      "query parameter editor",
      "URL breakdown",
      "URL builder",
      "edit URL parameters",
    ],
    icon: "link",
    relatedTools: [
      "url-encoder-decoder",
      "json-formatter",
      "base64-encoder-decoder",
    ],
    featured: false,
    searchWeight: 88,
    privacyNote:
      "URLs are parsed and rebuilt locally in your browser without being uploaded or saved.",
    browserProcessing: true,
    sensitive: false,
    inputType: "text",
    outputType: "structured-data",
    usageSteps: [
      "Paste a complete URL and select Parse URL.",
      "Review its components, then edit, add, remove, or reorder query parameters.",
      "Rebuild the URL and copy the correctly encoded result.",
    ],
    examples: [
      {
        name: "Edit repeated URL filters",
        input: "https://example.com/search?tag=design&tag=tools&q=coffee",
        output:
          "A component breakdown and an editable query list that keeps both tag parameters",
      },
    ],
    faqs: [
      {
        question: "Are my URLs uploaded?",
        answer:
          "No. Parsing and query editing happen only in your browser. URLs are never uploaded, logged, or saved.",
      },
      {
        question: "Are duplicate query parameters preserved?",
        answer:
          "Yes. Repeated keys such as tag=design and tag=tools stay separate and keep their order unless you edit them.",
      },
      {
        question:
          "Why does the rebuilt URL use plus signs for spaces in query values?",
        answer:
          "The browser uses standard form-style URL encoding for query strings, where a plus sign represents a space.",
      },
    ],
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    seo: {
      title: "URL Parser and Query String Editor - Edit URLs Locally",
      description:
        "Parse a URL and edit query parameters locally in your browser. View URL components, keep duplicate keys, rebuild encoded queries, and copy the result.",
    },
    status: "published",
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    shortDescription: "Render PDF pages as local PNG or JPEG images.",
    longDescription:
      "Convert PDF pages to PNG or JPEG images entirely in your browser. Select all pages or a range, choose resolution and JPEG quality, preview a few pages, and download each image without uploading your PDF.",
    category: "pdf",
    keywords: [
      "PDF to images",
      "PDF to PNG",
      "PDF to JPG",
      "convert PDF pages to images",
    ],
    aliases: ["PDF to JPEG", "PDF page to image", "PDF image converter"],
    icon: "file-text",
    relatedTools: ["split-pdf", "pdf-reorder-rotate-pages", "images-to-pdf"],
    featured: true,
    searchWeight: 92,
    privacyNote:
      "Your PDF is rendered locally in your browser and never uploaded.",
    browserProcessing: true,
    sensitive: false,
    inputType: "file",
    outputType: "image",
    usageSteps: [
      "Choose or drop one PDF file.",
      "Select all pages or a page range, then choose format and resolution.",
      "Convert pages and download the generated images individually.",
    ],
    examples: [
      {
        name: "Save selected report pages as PNG",
        input:
          "A 12-page PDF with pages 3 through 5 selected at High resolution",
        output:
          "Three PNG files named report-page-3.png through report-page-5.png",
      },
    ],
    faqs: [
      {
        question: "Are my PDF pages uploaded?",
        answer:
          "No. PDF rendering and image creation take place locally in your browser.",
      },
      {
        question: "Should I choose PNG or JPEG?",
        answer:
          "PNG is lossless and suits text, diagrams, and transparent content. JPEG is usually smaller for photographic pages and includes a quality control.",
      },
      {
        question: "Why is the number of pages limited?",
        answer:
          "Rendering many high-resolution pages can use substantial browser memory. The tool converts up to 50 pages at once so it remains reliable on mobile devices.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "PDF to Images - Convert PDF Pages to PNG or JPEG Locally",
      description:
        "Convert PDF pages to PNG or JPEG images locally in your browser. Select pages, set resolution and JPEG quality, then download without uploading.",
    },
    status: "published",
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    shortDescription: "Turn JPG, PNG, and WebP images into one local PDF.",
    longDescription:
      "Create one PDF from JPG, JPEG, PNG, and WebP images entirely in your browser. Reorder images, choose page size, orientation, and margins, then download the finished PDF without uploading your files.",
    category: "pdf",
    keywords: ["images to PDF", "JPG to PDF", "PNG to PDF", "WebP to PDF"],
    aliases: ["image to PDF", "photo to PDF", "convert images to PDF"],
    icon: "file-text",
    relatedTools: ["merge-pdf", "image-converter", "image-compressor"],
    featured: true,
    searchWeight: 93,
    privacyNote:
      "Your images are turned into a PDF locally in your browser and never uploaded.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "file",
    usageSteps: [
      "Choose or drop JPG, PNG, or WebP images.",
      "Set their PDF order and choose page size, orientation, and margins.",
      "Create the PDF and download it locally.",
    ],
    examples: [
      {
        name: "Create a PDF from phone photos",
        input: "Three JPG images ordered from cover to final page",
        output: "One three-page PDF named images.pdf",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. The PDF is created locally in your browser and your images never leave your device.",
      },
      {
        question: "Will my images be stretched?",
        answer:
          "No. Each image keeps its original aspect ratio and is centered within the selected page and margin area.",
      },
      {
        question: "Can I use transparent PNG images?",
        answer:
          "Yes. PNG transparency is retained in the PDF where the browser and PDF viewer support it.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Images to PDF - JPG, PNG and WebP to PDF Locally",
      description:
        "Convert JPG, PNG and WebP images to one PDF locally in your browser. Reorder pages, choose paper size and margins, then download without uploading.",
    },
    status: "published",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Extract or split PDF pages locally in your browser.",
    longDescription:
      "Split one PDF locally in your browser. Extract a page range or specific pages into a new PDF, or create a separate PDF for every page without uploading or rasterizing the document.",
    category: "pdf",
    keywords: ["split PDF", "extract PDF pages", "PDF page splitter"],
    aliases: ["PDF splitter", "separate PDF pages", "extract pages from PDF"],
    icon: "file-text",
    relatedTools: ["merge-pdf", "pdf-reorder-rotate-pages", "images-to-pdf"],
    featured: true,
    searchWeight: 93,
    privacyNote:
      "Your PDF is split locally in your browser and never uploaded.",
    browserProcessing: true,
    sensitive: false,
    inputType: "file",
    outputType: "file",
    usageSteps: [
      "Choose or drop one PDF file.",
      "Select a range, specific pages, or one PDF per page.",
      "Create and download the generated PDF or PDFs.",
    ],
    examples: [
      {
        name: "Extract selected report pages",
        input: "A 10-page PDF with pages 1-3,6,8-10 selected",
        output: "One PDF containing pages 1, 2, 3, 6, 8, 9, and 10",
      },
    ],
    faqs: [
      {
        question: "Are my PDFs uploaded?",
        answer:
          "No. The selected PDF stays on your device and is processed in your browser.",
      },
      {
        question: "Can I extract non-consecutive pages?",
        answer:
          "Yes. Enter a list such as 1-3,6,8-10 to create one PDF containing those pages in that order.",
      },
      {
        question: "Does splitting reduce page quality?",
        answer:
          "No. The tool copies PDF page objects into new PDFs and does not convert pages to images.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Split PDF - Extract PDF Pages Locally",
      description:
        "Split a PDF locally in your browser. Extract page ranges or specific pages, or save every page as its own PDF without uploading or rasterizing.",
    },
    status: "published",
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription:
      "Combine multiple PDF files locally in your chosen order.",
    longDescription:
      "Merge PDF documents directly in your browser. Reorder files, remove any you do not need, and download one PDF without uploading or rasterizing pages.",
    category: "pdf",
    keywords: ["merge PDF", "combine PDF", "join PDF files"],
    aliases: ["PDF merger", "combine PDFs", "join PDFs"],
    icon: "file-text",
    relatedTools: ["split-pdf", "images-to-pdf"],
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
    slug: "pdf-reorder-rotate-pages",
    name: "PDF Reorder and Rotate Pages",
    shortDescription: "Reorder and rotate PDF pages locally in your browser.",
    longDescription:
      "Reorder PDF pages and rotate individual pages in 90-degree steps without uploading your document. Pages are copied directly into a new PDF, preserving their original quality.",
    category: "pdf",
    keywords: [
      "reorder PDF pages",
      "rotate PDF pages",
      "PDF page editor",
      "rearrange PDF pages",
    ],
    aliases: [
      "PDF reorder",
      "rotate PDF",
      "move PDF pages",
      "organize PDF pages",
    ],
    icon: "file-text",
    relatedTools: ["merge-pdf", "split-pdf", "pdf-to-images"],
    featured: true,
    searchWeight: 92,
    privacyNote:
      "Your PDF never leaves your device. Page editing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "file",
    outputType: "file",
    usageSteps: [
      "Choose or drop one PDF file.",
      "Drag pages into order or use the move buttons, then rotate any page in 90-degree steps.",
      "Save and download the new PDF with your chosen page order and rotations.",
    ],
    examples: [
      {
        name: "Put a scanned report in reading order",
        input:
          "A four-page PDF with page 4 moved first and page 2 rotated 90 degrees",
        output: "A four-page PDF in the new order with page 2 rotated",
      },
    ],
    faqs: [
      {
        question: "Are my PDFs uploaded?",
        answer:
          "No. The PDF is edited locally in your browser and never leaves your device.",
      },
      {
        question: "Will reordering or rotating reduce page quality?",
        answer:
          "No. The tool copies PDF page objects into a new document instead of converting pages into images.",
      },
      {
        question: "Can I rotate more than one page?",
        answer:
          "Yes. Rotate any number of pages. Each press turns that page 90 degrees clockwise.",
      },
    ],
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    seo: {
      title: "PDF Reorder and Rotate Pages - Edit PDF Locally",
      description:
        "Reorder and rotate PDF pages locally in your browser. Move pages, turn individual pages in 90-degree steps, and download a new PDF without uploading.",
    },
    status: "published",
  },
  {
    slug: "remove-image-metadata",
    name: "Image Metadata Remover",
    shortDescription:
      "Create a local image export without copied source metadata.",
    longDescription:
      "Recreate PNG, JPG, JPEG, and supported WebP images locally from decoded pixels. The new export does not copy the original metadata containers, while keeping the displayed image orientation intact.",
    category: "image",
    keywords: ["remove image metadata", "remove EXIF", "strip image metadata"],
    aliases: ["EXIF remover", "image privacy cleaner", "remove photo data"],
    icon: "image",
    relatedTools: [
      "image-metadata-viewer",
      "image-compressor",
      "image-cropper",
    ],
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
    slug: "image-metadata-viewer",
    name: "Image Metadata Viewer",
    shortDescription:
      "View readable image metadata locally before sharing or exporting.",
    longDescription:
      "Inspect readable metadata in PNG, JPG, JPEG, and WebP images without uploading them. See common camera, date, orientation, location, XMP, IPTC, and PNG text fields, then open Metadata Remover when you want a new sanitized export.",
    category: "image",
    keywords: [
      "image metadata viewer",
      "view EXIF data",
      "photo metadata viewer",
      "image GPS metadata",
    ],
    aliases: [
      "EXIF viewer",
      "photo details viewer",
      "check image metadata",
      "view image location",
    ],
    icon: "image",
    relatedTools: [
      "remove-image-metadata",
      "image-converter",
      "rotate-flip-image",
    ],
    featured: false,
    searchWeight: 88,
    privacyNote:
      "Your image and its metadata stay on your device. Inspection happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "structured-data",
    usageSteps: [
      "Choose or drop a PNG, JPG, JPEG, or WebP image.",
      "Review locally readable camera, date, orientation, location, and other metadata fields.",
      "Open Image Metadata Remover if you want a new export without copied original metadata containers.",
    ],
    examples: [
      {
        name: "Check a photo before sharing",
        input: "A JPG phone photo with EXIF camera and GPS fields",
        output:
          "A local report listing readable camera details, date, orientation, and location fields",
      },
    ],
    faqs: [
      {
        question: "Are my images or metadata uploaded?",
        answer:
          "No. Inspection happens locally in your browser and neither the image nor its metadata leaves your device.",
      },
      {
        question: "Does this show every possible metadata field?",
        answer:
          "No. The viewer reports common readable EXIF, GPS, XMP, IPTC, PNG text, and color-profile fields. Some proprietary or malformed fields may not be shown.",
      },
      {
        question: "Can I remove the metadata I find?",
        answer:
          "Yes. Open Image Metadata Remover to create a new image export without copying the original metadata containers.",
      },
    ],
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    seo: {
      title: "Image Metadata Viewer - View EXIF and Photo Details Locally",
      description:
        "View readable EXIF, camera, date, location, XMP, and image metadata locally in your browser. Check a photo before sharing without uploading it.",
    },
    status: "published",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortDescription: "Crop PNG, JPG, and WebP images locally.",
    longDescription:
      "Crop PNG, JPG, JPEG, and WebP images entirely in your browser. Move and resize the crop area, choose a common aspect ratio, and download the result without uploading.",
    category: "image",
    keywords: ["image cropper", "crop image", "crop PNG", "crop JPG"],
    aliases: ["photo cropper", "image cutter", "crop WebP"],
    icon: "image",
    relatedTools: ["image-resizer", "rotate-flip-image", "image-converter"],
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
    slug: "rotate-flip-image",
    name: "Rotate and Flip Image",
    shortDescription: "Rotate or mirror PNG, JPG, and WebP images locally.",
    longDescription:
      "Rotate PNG, JPG, JPEG, and WebP images by 90, 180, or 270 degrees, or mirror them horizontally or vertically. Review the new dimensions and download the transformed image without uploading it.",
    category: "image",
    keywords: ["rotate image", "flip image", "mirror image", "rotate JPG"],
    aliases: [
      "rotate photo",
      "mirror photo",
      "flip PNG",
      "fix image orientation",
    ],
    icon: "image",
    relatedTools: ["image-resizer", "image-cropper", "image-converter"],
    featured: true,
    searchWeight: 90,
    privacyNote:
      "Your image never leaves your device. Processing happens locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "image",
    usageSteps: [
      "Choose or drop a PNG, JPG, JPEG, or WebP image.",
      "Choose a rotation and optional horizontal or vertical flip.",
      "Apply the transform, review the output dimensions, and download the new image.",
    ],
    examples: [
      {
        name: "Fix a sideways phone photo",
        input: "A 3024 × 4032 JPG rotated 90° clockwise",
        output: "A 4032 × 3024 JPG with the image pixels turned upright",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. Rotation and flipping happen locally in your browser, and your image never leaves your device.",
      },
      {
        question: "Why do the dimensions swap after a 90° rotation?",
        answer:
          "A quarter turn changes a landscape image into a portrait image or the reverse, so its width and height switch places.",
      },
      {
        question: "Will rotating preserve the original metadata?",
        answer:
          "The tool creates a new browser-rendered image export. Optional original metadata containers, such as camera details and location, may not be copied.",
      },
    ],
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    seo: {
      title: "Rotate and Flip Image - PNG, JPG and WebP Locally",
      description:
        "Rotate or flip PNG, JPG and WebP images locally in your browser. Fix image orientation, mirror photos, review dimensions, and download without uploading.",
    },
    status: "published",
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    shortDescription: "Create a browser-ready favicon package from one image.",
    longDescription:
      "Turn one PNG, JPG, JPEG, or WebP image into a complete favicon package locally in your browser. Download favicon.ico, standard PNG icon sizes, a web manifest, and installation markup in one ZIP file.",
    category: "image",
    keywords: [
      "favicon generator",
      "create favicon",
      "favicon.ico generator",
      "website icon generator",
    ],
    aliases: [
      "make favicon",
      "favicon creator",
      "generate favicon.ico",
      "app icon generator",
    ],
    icon: "image",
    relatedTools: ["image-resizer", "image-converter", "rotate-flip-image"],
    featured: true,
    searchWeight: 89,
    privacyNote:
      "Your image never leaves your device. The favicon package is created locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "image",
    outputType: "file",
    usageSteps: [
      "Choose or drop one PNG, JPG, JPEG, or WebP image.",
      "Create the package; square images work best, but any image is fitted inside each icon.",
      "Download the ZIP and place its files in your site root using the included installation snippet.",
    ],
    examples: [
      {
        name: "Create website icons from a logo",
        input: "A transparent 1024 × 1024 PNG logo",
        output:
          "A ZIP with favicon.ico, PNG icons, site.webmanifest, and favicon markup",
      },
    ],
    faqs: [
      {
        question: "Are my images uploaded?",
        answer:
          "No. The favicon files are generated locally in your browser and your image never leaves your device.",
      },
      {
        question: "What files are in the package?",
        answer:
          "The ZIP contains favicon.ico, 16, 32, and 48 pixel PNG favicons, Apple and Android PNG icons, site.webmanifest, and an installation snippet.",
      },
      {
        question: "Does my source image need to be square?",
        answer:
          "No. Square artwork gives the most predictable result. Other images are scaled to fit inside the square icon without cropping.",
      },
    ],
    publishedAt: "2026-08-17",
    updatedAt: "2026-08-17",
    seo: {
      title: "Favicon Generator - Create favicon.ico and Icon Package",
      description:
        "Create a browser-ready favicon package from one image. Download favicon.ico, PNG icon sizes, a web manifest, and install markup locally in your browser.",
    },
    status: "published",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription: "Resize PNG, JPG, and WebP images locally.",
    longDescription:
      "Resize PNG, JPG, JPEG, and WebP images to exact dimensions in your browser. Keep the aspect ratio by default, choose an output format, and download locally.",
    category: "image",
    keywords: ["image resizer", "resize image", "change image dimensions"],
    aliases: ["resize PNG", "resize JPG", "resize WebP"],
    icon: "image",
    relatedTools: ["image-cropper", "rotate-flip-image", "favicon-generator"],
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
    category: "image",
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
    category: "image",
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
