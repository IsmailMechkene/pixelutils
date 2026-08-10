export interface TextCleanupOptions { readonly trimLines: boolean; readonly collapseSpaces: boolean; readonly removeEmptyLines: boolean; }
export function cleanText(input: string, options: TextCleanupOptions) {
  const lines = input.replace(/\r\n?/g, "\n").split("\n").map((line) => {
    const spaced = options.collapseSpaces ? line.replace(/[\t ]+/g, " ") : line;
    return options.trimLines ? spaced.trim() : spaced;
  });
  return (options.removeEmptyLines ? lines.filter((line) => line.length > 0) : lines).join("\n");
}
