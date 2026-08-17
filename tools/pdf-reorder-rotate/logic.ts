export type PdfPageEdit = {
  readonly sourceIndex: number;
  readonly rotation: 0 | 90 | 180 | 270;
};

export function createPdfPageEdits(pageCount: number): PdfPageEdit[] {
  return Array.from({ length: pageCount }, (_, sourceIndex) => ({
    sourceIndex,
    rotation: 0,
  }));
}

export function movePdfPageEdit(
  pages: readonly PdfPageEdit[],
  fromIndex: number,
  toIndex: number,
) {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= pages.length ||
    toIndex >= pages.length ||
    fromIndex === toIndex
  )
    return [...pages];
  const next = [...pages];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function rotatePdfPageEdit(
  pages: readonly PdfPageEdit[],
  sourceIndex: number,
) {
  return pages.map((page) =>
    page.sourceIndex === sourceIndex
      ? {
          ...page,
          rotation: ((page.rotation + 90) % 360) as PdfPageEdit["rotation"],
        }
      : page,
  );
}

export function getEditedPdfFilename(filename: string) {
  const stem = filename.replace(/\.pdf$/i, "") || "document";
  return `${stem}-edited.pdf`;
}
