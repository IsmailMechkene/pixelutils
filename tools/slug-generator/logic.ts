export function createSlug(input: string, separator = "-") {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");
}
