export const caseModes = [
  "uppercase",
  "lowercase",
  "title",
  "sentence",
  "camel",
  "pascal",
  "snake",
  "kebab",
] as const;

export type CaseMode = (typeof caseModes)[number];

function capitalize(value: string) {
  const [first = "", ...rest] = Array.from(value);
  return first.toLocaleUpperCase() + rest.join("").toLocaleLowerCase();
}

function words(input: string) {
  return (
    input
      .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
      .match(/[\p{L}\p{N}]+/gu) ?? []
  );
}

export function convertTextCase(input: string, mode: CaseMode) {
  if (mode === "uppercase") return input.toLocaleUpperCase();
  if (mode === "lowercase") return input.toLocaleLowerCase();
  if (mode === "title") {
    return input.replace(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu, capitalize);
  }
  if (mode === "sentence") {
    const lower = input.toLocaleLowerCase();
    return lower.replace(/(^|[.!?]\s+)(\p{L})/gu, (_, prefix: string, letter: string) =>
      prefix + letter.toLocaleUpperCase(),
    );
  }

  const tokens = words(input).map((word) => word.toLocaleLowerCase());
  if (mode === "camel") {
    return tokens.map((word, index) => (index === 0 ? word : capitalize(word))).join("");
  }
  if (mode === "pascal") return tokens.map(capitalize).join("");
  return tokens.join(mode === "snake" ? "_" : "-");
}
