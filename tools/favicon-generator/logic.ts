export const faviconPngSizes = [16, 32, 48, 180, 192, 512] as const;

export type FaviconPngSize = (typeof faviconPngSizes)[number];

export type BinaryFile = {
  readonly name: string;
  readonly data: Uint8Array;
};

const encoder = new TextEncoder();

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const value of data) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function getFaviconPngName(size: FaviconPngSize) {
  if (size === 180) return "apple-touch-icon.png";
  if (size === 192) return "android-chrome-192x192.png";
  if (size === 512) return "android-chrome-512x512.png";
  return `favicon-${size}x${size}.png`;
}

export function createIco(
  images: readonly { readonly size: 16 | 32 | 48; readonly data: Uint8Array }[],
) {
  const headerBytes = 6 + images.length * 16;
  const output = new Uint8Array(
    headerBytes + images.reduce((total, image) => total + image.data.length, 0),
  );
  const view = new DataView(output.buffer);
  writeUint16(view, 0, 0);
  writeUint16(view, 2, 1);
  writeUint16(view, 4, images.length);
  let dataOffset = headerBytes;
  images.forEach((image, index) => {
    const entryOffset = 6 + index * 16;
    output[entryOffset] = image.size;
    output[entryOffset + 1] = image.size;
    output[entryOffset + 2] = 0;
    output[entryOffset + 3] = 0;
    writeUint16(view, entryOffset + 4, 1);
    writeUint16(view, entryOffset + 6, 32);
    writeUint32(view, entryOffset + 8, image.data.length);
    writeUint32(view, entryOffset + 12, dataOffset);
    output.set(image.data, dataOffset);
    dataOffset += image.data.length;
  });
  return output;
}

export function createStoredZip(files: readonly BinaryFile[]) {
  const prepared = files.map((file) => ({
    ...file,
    nameBytes: encoder.encode(file.name),
    checksum: crc32(file.data),
  }));
  const localBytes = prepared.reduce(
    (total, file) => total + 30 + file.nameBytes.length + file.data.length,
    0,
  );
  const centralBytes = prepared.reduce(
    (total, file) => total + 46 + file.nameBytes.length,
    0,
  );
  const output = new Uint8Array(localBytes + centralBytes + 22);
  const view = new DataView(output.buffer);
  let offset = 0;
  const localOffsets: number[] = [];
  for (const file of prepared) {
    localOffsets.push(offset);
    writeUint32(view, offset, 0x04034b50);
    writeUint16(view, offset + 4, 20);
    writeUint16(view, offset + 6, 0x0800);
    writeUint16(view, offset + 8, 0);
    writeUint32(view, offset + 14, file.checksum);
    writeUint32(view, offset + 18, file.data.length);
    writeUint32(view, offset + 22, file.data.length);
    writeUint16(view, offset + 26, file.nameBytes.length);
    writeUint16(view, offset + 28, 0);
    output.set(file.nameBytes, offset + 30);
    output.set(file.data, offset + 30 + file.nameBytes.length);
    offset += 30 + file.nameBytes.length + file.data.length;
  }
  const centralOffset = offset;
  prepared.forEach((file, index) => {
    writeUint32(view, offset, 0x02014b50);
    writeUint16(view, offset + 4, 20);
    writeUint16(view, offset + 6, 20);
    writeUint16(view, offset + 8, 0x0800);
    writeUint16(view, offset + 10, 0);
    writeUint32(view, offset + 16, file.checksum);
    writeUint32(view, offset + 20, file.data.length);
    writeUint32(view, offset + 24, file.data.length);
    writeUint16(view, offset + 28, file.nameBytes.length);
    writeUint16(view, offset + 30, 0);
    writeUint16(view, offset + 32, 0);
    writeUint16(view, offset + 34, 0);
    writeUint16(view, offset + 36, 0);
    writeUint32(view, offset + 38, 0);
    writeUint32(view, offset + 42, localOffsets[index]);
    output.set(file.nameBytes, offset + 46);
    offset += 46 + file.nameBytes.length;
  });
  writeUint32(view, offset, 0x06054b50);
  writeUint16(view, offset + 4, 0);
  writeUint16(view, offset + 6, 0);
  writeUint16(view, offset + 8, files.length);
  writeUint16(view, offset + 10, files.length);
  writeUint32(view, offset + 12, centralBytes);
  writeUint32(view, offset + 16, centralOffset);
  writeUint16(view, offset + 20, 0);
  return output;
}

export function createWebManifest(siteName: string) {
  const name = siteName.trim() || "Website";
  return `${JSON.stringify(
    {
      name,
      short_name: name.slice(0, 48),
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  )}\n`;
}

export function createInstallSnippet() {
  return `<!-- Place these files in your site root. -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
`;
}
