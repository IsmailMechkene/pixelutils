export const qrErrorLevels = ["L", "M", "Q", "H"] as const;
export type QrErrorLevel = (typeof qrErrorLevels)[number];

export interface QrOptions {
  readonly text: string;
  readonly size: number;
  readonly margin: number;
  readonly errorLevel: QrErrorLevel;
  readonly darkColor: string;
  readonly lightColor: string;
}

export function validateQrOptions(options: QrOptions) {
  if (!options.text.trim()) throw new Error("Enter text or a URL for the QR code.");
  if (Array.from(options.text).length > 2_000) {
    throw new Error("QR content must be 2,000 characters or fewer.");
  }
  if (!Number.isInteger(options.size) || options.size < 128 || options.size > 1024) {
    throw new Error("Image size must be a whole number from 128 to 1024 pixels.");
  }
  if (!Number.isInteger(options.margin) || options.margin < 0 || options.margin > 10) {
    throw new Error("Margin must be a whole number from 0 to 10 modules.");
  }
  if (!qrErrorLevels.includes(options.errorLevel)) {
    throw new Error("Select a valid error-correction level.");
  }
  if (!/^#[0-9a-f]{6}$/i.test(options.darkColor) || !/^#[0-9a-f]{6}$/i.test(options.lightColor)) {
    throw new Error("QR colors must be six-digit hex values.");
  }
  if (options.darkColor.toLowerCase() === options.lightColor.toLowerCase()) {
    throw new Error("Foreground and background colors must be different.");
  }
  return options;
}
