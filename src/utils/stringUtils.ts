export const firstLetterToUpperCase = (ord: string): string => {
  return ord.charAt(0).toUpperCase() + ord.slice(1);
};

export const capitalizeWord = (word: string): string => {
  return firstLetterToUpperCase(word.toLowerCase());
};

export const capitalizeAllWords = (word: string): string =>
  word
    .split(/\s/)
    .map((word) => capitalizeWord(word))
    .join(" ")
    .trim();
export const containsWhiteSpace = (string: string) => {
  return /\s/g.test(string);
};
