export interface RgbaColor { readonly r: number; readonly g: number; readonly b: number; readonly a: number }
export type ColorResult =
  | { readonly ok: true; readonly color: RgbaColor; readonly hex: string; readonly rgb: string; readonly hsl: string }
  | { readonly ok: false; readonly error: string };

function clampRound(value: number) { return Math.round(Math.min(255, Math.max(0, value))); }
function normalizeHue(value: number) { return ((value % 360) + 360) % 360; }
function formatAlpha(value: number) { return Number(value.toFixed(3)).toString(); }

function fromHex(input: string): RgbaColor | undefined {
  const match = input.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!match) return undefined;
  let value = match[1] ?? "";
  if (value.length <= 4) value = Array.from(value, (character) => character + character).join("");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
    a: value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1,
  };
}

function numberList(input: string, name: string) {
  const match = input.match(new RegExp(`^${name}a?\\((.*)\\)$`, "i"));
  if (!match) return undefined;
  return (match[1] ?? "").split(/[,/]/).map((value) => value.trim());
}

function fromRgb(input: string): RgbaColor | undefined {
  const values = numberList(input, "rgb");
  if (!values || values.length < 3 || values.length > 4) return undefined;
  const [r, g, b, a = 1] = values.map(Number);
  if ([r, g, b, a].some((value) => !Number.isFinite(value))) return undefined;
  if (r! < 0 || r! > 255 || g! < 0 || g! > 255 || b! < 0 || b! > 255 || a! < 0 || a! > 1) return undefined;
  return { r: clampRound(r!), g: clampRound(g!), b: clampRound(b!), a: a! };
}

function fromHsl(input: string): RgbaColor | undefined {
  const values = numberList(input, "hsl");
  if (!values || values.length < 3 || values.length > 4) return undefined;
  const hue = Number(values[0]);
  const saturation = Number((values[1] ?? "").replace(/%$/, ""));
  const lightness = Number((values[2] ?? "").replace(/%$/, ""));
  const alpha = Number(values[3] ?? "1");
  if (![hue, saturation, lightness, alpha].every(Number.isFinite) || saturation < 0 || saturation > 100 || lightness < 0 || lightness > 100 || alpha < 0 || alpha > 1) return undefined;
  const h = normalizeHue(hue) / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const hueToRgb = (p: number, q: number, raw: number) => {
    let t = raw;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  if (s === 0) return { r: clampRound(l * 255), g: clampRound(l * 255), b: clampRound(l * 255), a: alpha };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return { r: clampRound(hueToRgb(p, q, h + 1 / 3) * 255), g: clampRound(hueToRgb(p, q, h) * 255), b: clampRound(hueToRgb(p, q, h - 1 / 3) * 255), a: alpha };
}

function toHsl({ r, g, b }: RgbaColor) {
  const red = r / 255, green = g / 255, blue = b / 255;
  const maximum = Math.max(red, green, blue), minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;
  if (delta) {
    if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  const lightness = (maximum + minimum) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return { h: Math.round(normalizeHue(hue)), s: Math.round(saturation * 100), l: Math.round(lightness * 100) };
}

export function convertColor(input: string): ColorResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Enter a HEX, RGB, or HSL color." };
  const color = fromHex(trimmed) ?? fromRgb(trimmed) ?? fromHsl(trimmed);
  if (!color) return { ok: false, error: "Use HEX (#RRGGBB), rgb(r, g, b), or hsl(h, s%, l%) with an optional alpha value." };
  const hexParts = [color.r, color.g, color.b].map((value) => value.toString(16).padStart(2, "0"));
  if (color.a < 1) hexParts.push(clampRound(color.a * 255).toString(16).padStart(2, "0"));
  const hsl = toHsl(color);
  return {
    ok: true,
    color,
    hex: `#${hexParts.join("").toUpperCase()}`,
    rgb: color.a < 1 ? `rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(color.a)})` : `rgb(${color.r}, ${color.g}, ${color.b})`,
    hsl: color.a < 1 ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${formatAlpha(color.a)})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };
}
