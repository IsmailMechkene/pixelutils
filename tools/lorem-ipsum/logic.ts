export type LoremUnit = "paragraphs" | "sentences" | "words";
export type RandomIndex = (maximum: number) => number;

export interface LoremOptions {
  readonly unit: LoremUnit;
  readonly count: number;
  readonly startWithLorem: boolean;
}

const vocabulary = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
  "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "labore", "dolore",
  "magna", "aliqua", "enim", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "commodo", "consequat", "duis", "aute",
  "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat",
] as const;

function validate(options: LoremOptions) {
  const maximum = options.unit === "words" ? 500 : options.unit === "sentences" ? 50 : 20;
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > maximum) {
    throw new Error(`Count must be a whole number from 1 to ${maximum}.`);
  }
}

function pick(randomIndex: RandomIndex) {
  const index = randomIndex(vocabulary.length);
  if (!Number.isInteger(index) || index < 0 || index >= vocabulary.length) {
    throw new Error("The random source returned an invalid word index.");
  }
  return vocabulary[index] ?? "lorem";
}

function sentence(randomIndex: RandomIndex, wordCount = 10) {
  const words = Array.from({ length: wordCount }, () => pick(randomIndex));
  const text = words.join(" ");
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

export function generateLorem(options: LoremOptions, randomIndex: RandomIndex) {
  validate(options);
  let result: string;
  if (options.unit === "words") {
    result = Array.from({ length: options.count }, () => pick(randomIndex)).join(" ");
  } else if (options.unit === "sentences") {
    result = Array.from({ length: options.count }, (_, index) =>
      sentence(randomIndex, 8 + (index % 5)),
    ).join(" ");
  } else {
    result = Array.from({ length: options.count }, (_, paragraphIndex) =>
      Array.from({ length: 4 + (paragraphIndex % 2) }, (_, sentenceIndex) =>
        sentence(randomIndex, 8 + (sentenceIndex % 5)),
      ).join(" "),
    ).join("\n\n");
  }

  if (!options.startWithLorem) return result;
  const opening = "Lorem ipsum dolor sit amet";
  if (options.unit === "words") {
    const words = result.split(" ");
    return [...opening.split(" ").slice(0, options.count), ...words.slice(Math.min(5, options.count))].join(" ");
  }
  const remainder = result.replace(/^[^.]*\.?/, "").trimStart();
  return `${opening}, consectetur adipiscing elit.${remainder ? ` ${remainder}` : ""}`;
}
