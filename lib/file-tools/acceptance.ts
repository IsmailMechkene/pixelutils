function normalizeAcceptValue(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function acceptsFile(
  file: Pick<File, "name" | "type">,
  accept?: string,
): boolean {
  if (!accept) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return normalizeAcceptValue(accept).some((acceptedType) => {
    if (acceptedType.startsWith(".")) return name.endsWith(acceptedType);
    if (acceptedType.endsWith("/*")) {
      return type.startsWith(acceptedType.slice(0, -1));
    }
    return type === acceptedType;
  });
}
