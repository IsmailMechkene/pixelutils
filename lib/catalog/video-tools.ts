import type { ToolDefinition } from "./types";

const date = "2026-08-10";

export const videoTools = [
  {
    slug: "video-compressor",
    name: "Video Compressor",
    shortDescription: "Make a smaller MP4 video locally with simple quality and resolution choices.",
    longDescription:
      "Compress MP4, WebM, MKV, MOV, and other video files supported by the local conversion engine. Choose a plain-language quality preset and an optional maximum resolution, then download a smaller MP4 without uploading your video.",
    category: "video",
    keywords: ["video compressor", "compress video", "reduce video file size"],
    aliases: ["video size reducer", "shrink video", "compress MP4"],
    icon: "video",
    relatedTools: ["mkv-to-mp4"],
    featured: true,
    searchWeight: 95,
    privacyNote:
      "Your video is compressed locally in your browser and never uploaded.",
    browserProcessing: true,
    sensitive: false,
    inputType: "video",
    outputType: "video",
    usageSteps: [
      "Choose or drop one video file.",
      "Choose Smaller File, Balanced, or Higher Quality and an optional maximum resolution.",
      "Compress locally, then download the MP4 output.",
    ],
    examples: [
      {
        name: "Share a smaller phone video",
        input: "A 1080p MP4 using the Balanced preset and 720p maximum resolution",
        output: "A smaller MP4 that is no larger than 720p",
      },
    ],
    faqs: [
      {
        question: "Are videos uploaded for compression?",
        answer:
          "No. The source video and the compressed result remain on your device. The browser downloads only PixelUtils' conversion engine from the same origin.",
      },
      {
        question: "Will the compressor make my video larger?",
        answer:
          "It is designed to reduce file size, but the output size depends on the source format and content. PixelUtils shows the final size before you download it.",
      },
      {
        question: "Will choosing 1080p enlarge a smaller video?",
        answer:
          "No. Resolution choices are maximums. A video that is already smaller keeps its original dimensions rather than being upscaled.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "Video Compressor - Reduce Video Size Locally",
      description:
        "Compress video locally in your browser. Choose a simple quality preset and maximum resolution, then download a smaller MP4 without uploading.",
    },
    status: "published",
  },
  {
    slug: "mkv-to-mp4",
    name: "MKV to MP4 Converter",
    shortDescription: "Convert MKV video to MP4 locally, preserving compatible streams first.",
    longDescription:
      "Convert an MKV video to MP4 entirely in your browser. PixelUtils first tries to copy MP4-compatible audio and video streams without re-encoding, which preserves quality and is usually faster. If the original codecs cannot be used in MP4, you can choose a separate re-encoding fallback.",
    category: "video",
    keywords: ["MKV to MP4", "convert MKV to MP4", "MKV converter"],
    aliases: ["MKV converter", "Matroska to MP4", "change MKV to MP4"],
    icon: "video",
    relatedTools: [],
    featured: true,
    searchWeight: 94,
    privacyNote:
      "Your video stays on your device. Conversion runs locally in your browser.",
    browserProcessing: true,
    sensitive: false,
    inputType: "video",
    outputType: "video",
    usageSteps: [
      "Choose or drop one MKV video file.",
      "Select Create MP4 to inspect its streams and try a quality-preserving copy when compatible.",
      "If required, explicitly choose the re-encoding fallback, then download the MP4 file.",
    ],
    examples: [
      {
        name: "Make a compatible MP4 copy",
        input: "A short MKV with H.264 video and AAC audio",
        output: "An MP4 file with the same encoded video and audio streams",
      },
    ],
    faqs: [
      {
        question: "Will this reduce video quality?",
        answer:
          "Not when the video and audio streams can be copied into MP4. If a stream is not MP4-compatible, the tool explains that re-encoding is needed and waits for your confirmation.",
      },
      {
        question: "Are MKV videos uploaded?",
        answer:
          "No. The video and MP4 output remain on your device. PixelUtils only downloads its own conversion engine from the same site origin.",
      },
      {
        question: "Why are larger videos limited?",
        answer:
          "Browser conversion needs memory for the source file, the conversion engine, and the result. This first version accepts files up to 100 MB to reduce the risk of a browser tab running out of memory.",
      },
    ],
    publishedAt: date,
    updatedAt: date,
    seo: {
      title: "MKV to MP4 Converter - Convert Locally in Your Browser",
      description:
        "Convert MKV to MP4 locally in your browser. Preserve compatible streams without re-encoding, or choose a clear fallback when conversion is required.",
    },
    status: "published",
  },
] as const satisfies readonly ToolDefinition[];
