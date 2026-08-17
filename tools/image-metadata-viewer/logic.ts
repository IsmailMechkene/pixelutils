export type MetadataField = {
  readonly group: "EXIF" | "Location" | "Other";
  readonly label: string;
  readonly value: string;
};

const typeSizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8 };

function readText(data: Uint8Array, offset: number, length: number) {
  return new TextDecoder("latin1")
    .decode(data.slice(offset, offset + length))
    .replace(/\0+$/, "")
    .trim();
}

function parseExif(data: Uint8Array, start: number, length: number) {
  const end = Math.min(data.length, start + length);
  if (start + 8 > end) return [] as MetadataField[];
  const order = readText(data, start, 2);
  if (order !== "II" && order !== "MM") return [] as MetadataField[];
  const little = order === "II";
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const u16 = (offset: number) => view.getUint16(offset, little);
  const u32 = (offset: number) => view.getUint32(offset, little);
  if (u16(start + 2) !== 42) return [];
  const fields: MetadataField[] = [];
  const pointers = new Map<number, number>();
  const add = (group: MetadataField["group"], label: string, value: string) => {
    if (value) fields.push({ group, label, value });
  };
  const valueOffset = (entry: number, type: number, count: number) => {
    const bytes = typeSizes[type] * count;
    if (!bytes) return -1;
    return bytes <= 4 ? entry + 8 : start + u32(entry + 8);
  };
  const readAscii = (entry: number, type: number, count: number) =>
    type === 2 ? readText(data, valueOffset(entry, type, count), count) : "";
  const readRationals = (entry: number, type: number, count: number) => {
    const offset = valueOffset(entry, type, count);
    if (type !== 5 || offset < start || offset + count * 8 > end) return [];
    return Array.from({ length: count }, (_, index) => {
      const numerator = u32(offset + index * 8);
      const denominator = u32(offset + index * 8 + 4);
      return denominator ? numerator / denominator : 0;
    });
  };
  const readIfd = (offset: number, group: MetadataField["group"]) => {
    if (offset < start || offset + 2 > end) return;
    const count = Math.min(u16(offset), 64);
    for (let index = 0; index < count; index += 1) {
      const entry = offset + 2 + index * 12;
      if (entry + 12 > end) break;
      const tag = u16(entry);
      const type = u16(entry + 2);
      const valueCount = u32(entry + 4);
      if (!typeSizes[type] || valueCount > 1024) continue;
      if (tag === 0x8769 || tag === 0x8825)
        pointers.set(tag, start + u32(entry + 8));
      const text = readAscii(entry, type, valueCount);
      if (tag === 0x010f) add("EXIF", "Camera make", text);
      if (tag === 0x0110) add("EXIF", "Camera model", text);
      if (tag === 0x0132) add("EXIF", "Modified", text);
      if (tag === 0x9003) add("EXIF", "Date taken", text);
      if (tag === 0x9004) add("EXIF", "Created", text);
      if (tag === 0xa434) add("EXIF", "Lens model", text);
      if (tag === 0x0112 && type === 3) {
        const offsetValue = valueOffset(entry, type, valueCount);
        if (offsetValue >= start && offsetValue + 2 <= end)
          add("EXIF", "Orientation", String(u16(offsetValue)));
      }
      if (group === "Location" && (tag === 1 || tag === 3))
        add(
          "Location",
          tag === 1 ? "Latitude reference" : "Longitude reference",
          text,
        );
      if (group === "Location" && (tag === 2 || tag === 4)) {
        const values = readRationals(entry, type, valueCount);
        if (values.length === 3)
          add(
            "Location",
            tag === 2 ? "Latitude" : "Longitude",
            `${values[0].toFixed(0)}° ${values[1].toFixed(0)}′ ${values[2].toFixed(2)}″`,
          );
      }
    }
  };
  readIfd(start + u32(start + 4), "EXIF");
  const exifIfd = pointers.get(0x8769);
  if (exifIfd) readIfd(exifIfd, "EXIF");
  const gpsIfd = pointers.get(0x8825);
  if (gpsIfd) readIfd(gpsIfd, "Location");
  return fields;
}

function inspectJpeg(data: Uint8Array) {
  const fields: MetadataField[] = [];
  let offset = 2;
  while (offset + 4 <= data.length && data[offset] === 0xff) {
    const marker = data[offset + 1];
    const size = (data[offset + 2] << 8) | data[offset + 3];
    if (size < 2 || offset + 2 + size > data.length) break;
    const payload = offset + 4;
    const length = size - 2;
    const signature = readText(data, payload, Math.min(length, 29));
    if (marker === 0xe1 && signature.startsWith("Exif"))
      fields.push(...parseExif(data, payload + 6, length - 6));
    if (marker === 0xe1 && signature.includes("http://ns.adobe.com/xap"))
      fields.push({
        group: "Other",
        label: "XMP",
        value: "Metadata block present",
      });
    if (marker === 0xed)
      fields.push({
        group: "Other",
        label: "IPTC",
        value: "Metadata block present",
      });
    offset += size + 2;
  }
  return fields;
}

function inspectPng(data: Uint8Array) {
  const fields: MetadataField[] = [];
  let offset = 8;
  while (offset + 12 <= data.length) {
    const length = new DataView(
      data.buffer,
      data.byteOffset + offset,
      4,
    ).getUint32(0);
    const type = readText(data, offset + 4, 4);
    if (offset + 12 + length > data.length) break;
    if (type === "tEXt") {
      const text = readText(data, offset + 8, length);
      const separator = text.indexOf("\0");
      fields.push({
        group: "Other",
        label: separator > -1 ? text.slice(0, separator) : "PNG text",
        value: separator > -1 ? text.slice(separator + 1) : text,
      });
    }
    if (type === "iTXt")
      fields.push({
        group: "Other",
        label: "PNG international text",
        value: "Metadata block present",
      });
    offset += 12 + length;
  }
  return fields;
}

function inspectWebp(data: Uint8Array) {
  const fields: MetadataField[] = [];
  let offset = 12;
  while (offset + 8 <= data.length) {
    const type = readText(data, offset, 4);
    const length = new DataView(
      data.buffer,
      data.byteOffset + offset + 4,
      4,
    ).getUint32(0, true);
    const payload = offset + 8;
    if (payload + length > data.length) break;
    if (type === "EXIF") fields.push(...parseExif(data, payload, length));
    if (type === "XMP ")
      fields.push({
        group: "Other",
        label: "XMP",
        value: "Metadata block present",
      });
    if (type === "ICCP")
      fields.push({
        group: "Other",
        label: "ICC profile",
        value: "Color profile present",
      });
    offset = payload + length + (length % 2);
  }
  return fields;
}

export function inspectImageMetadata(data: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return inspectJpeg(data);
  if (mimeType === "image/png") return inspectPng(data);
  if (mimeType === "image/webp") return inspectWebp(data);
  return [];
}
