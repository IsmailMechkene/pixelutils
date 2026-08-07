export type SelectNavigationKey = "ArrowDown" | "ArrowUp" | "Home" | "End";

export function getNextSelectIndex(
  currentIndex: number,
  optionCount: number,
  key: SelectNavigationKey,
) {
  if (optionCount <= 0) return -1;
  if (key === "Home") return 0;
  if (key === "End") return optionCount - 1;
  if (currentIndex < 0) return key === "ArrowUp" ? optionCount - 1 : 0;
  return key === "ArrowDown"
    ? (currentIndex + 1) % optionCount
    : (currentIndex - 1 + optionCount) % optionCount;
}

export function findSelectOptionByPrefix(
  labels: readonly string[],
  query: string,
  currentIndex: number,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery || labels.length === 0) return -1;

  for (let offset = 1; offset <= labels.length; offset += 1) {
    const index = (Math.max(currentIndex, -1) + offset) % labels.length;
    if (labels[index]?.toLocaleLowerCase().startsWith(normalizedQuery)) {
      return index;
    }
  }

  return -1;
}
