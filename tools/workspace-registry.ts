import type { ComponentType } from "react";

import type { ToolSlug } from "@/lib/catalog/registry";

export interface ToolWorkspaceProps {
  slug: ToolSlug;
}

export type ToolWorkspaceModule = {
  default: ComponentType<ToolWorkspaceProps>;
};

// Each entry must use a direct dynamic import so Next.js creates one isolated
// chunk per tool. Add a loader in the same change that publishes the tool.
export const toolWorkspaceLoaders = {
  "merge-pdf": () => import("./merge-pdf/workspace"),
  "remove-image-metadata": () =>
    import("./image-metadata-remover/workspace"),
  "image-cropper": () => import("./image-cropper/workspace"),
  "image-converter": () => import("./image-converter/workspace"),
  "image-resizer": () => import("./image-resizer/workspace"),
  "png-to-jpg": () => import("./image-converter/workspace"),
  "jpg-to-png": () => import("./image-converter/workspace"),
  "png-to-webp": () => import("./image-converter/workspace"),
  "jpg-to-webp": () => import("./image-converter/workspace"),
  "webp-to-png": () => import("./image-converter/workspace"),
  "webp-to-jpg": () => import("./image-converter/workspace"),
  "image-compressor": () => import("./image-compressor/workspace"),
  "json-formatter": () => import("./json-formatter/workspace"),
  "json-minifier": () => import("./json-minifier/workspace"),
  "base64-encoder-decoder": () => import("./base64/workspace"),
  "url-encoder-decoder": () => import("./url-encoder/workspace"),
  "uuid-generator": () => import("./uuid-generator/workspace"),
  "unix-timestamp-converter": () => import("./unix-timestamp/workspace"),
  "word-character-counter": () => import("./word-counter/workspace"),
  "text-case-converter": () => import("./text-case-converter/workspace"),
  "duplicate-line-remover": () => import("./duplicate-line-remover/workspace"),
  "password-generator": () => import("./password-generator/workspace"),
  "html-escape-unescape": () => import("./html-escape/workspace"),
  "html-formatter": () => import("./html-formatter/workspace"),
  "markdown-previewer": () => import("./markdown-previewer/workspace"),
  "lorem-ipsum-generator": () => import("./lorem-ipsum/workspace"),
  "qr-code-generator": () => import("./qr-code-generator/workspace"),
  "color-converter": () => import("./color-converter/workspace"),
  "hash-generator": () => import("./hash-generator/workspace"),
  "jwt-decoder": () => import("./jwt-decoder/workspace"),
  "percentage-calculator": () => import("./percentage-calculator/workspace"),
  "age-calculator": () => import("./age-calculator/workspace"),
  "yaml-formatter-validator": () => import("./yaml-formatter/workspace"),
  "xml-formatter-validator": () => import("./xml-formatter/workspace"),
  "csv-to-json-converter": () => import("./csv-to-json/workspace"),
  "text-cleaner": () => import("./text-cleaner/workspace"),
  "slug-generator": () => import("./slug-generator/workspace"),
  "color-contrast-checker": () => import("./color-contrast-checker/workspace"),
  "discount-calculator": () => import("./discount-calculator/workspace"),
  "date-difference-calculator": () =>
    import("./date-difference-calculator/workspace"),
} satisfies Record<ToolSlug, () => Promise<ToolWorkspaceModule>>;

export const toolWorkspaceSlugs = Object.freeze(
  Object.keys(toolWorkspaceLoaders) as ToolSlug[],
);
