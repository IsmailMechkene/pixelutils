export interface TextCounts {
  readonly words: number;
  readonly characters: number;
  readonly charactersWithoutWhitespace: number;
  readonly lines: number;
  readonly sentences: number;
}

const wordPattern = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;
const sentencePattern =
  /[^.!?\s](?:[^.!?]*[^.!?\s])?[.!?]+(?=\s|$)|[^.!?\s](?:[^.!?]*[^.!?\s])?$/gu;

export function countText(input: string): TextCounts {
  return {
    words: input.match(wordPattern)?.length ?? 0,
    characters: Array.from(input).length,
    charactersWithoutWhitespace: Array.from(input).filter(
      (character) => !/\s/u.test(character),
    ).length,
    lines: input ? input.split(/\r\n|\r|\n/).length : 0,
    sentences: input.match(sentencePattern)?.length ?? 0,
  };
}
