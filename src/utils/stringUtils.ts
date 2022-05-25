export const firstLetterToUpperCase = (ord: string): string => {
  return ord.charAt(0).toUpperCase() + ord.slice(1);
};

export const capitalizeWord = (word: string): string => {
  return firstLetterToUpperCase(word.toLowerCase());
};

export const capitalizeAllWords = (word: string): string =>
  word
    .split(/\s/)
    .map((word) =>
      word
        .split("-")
        .map((word) => capitalizeWord(word))
        .join("-")
    )
    .join(" ")
    .trim();

export const containsWhiteSpace = (str: string) => {
  return /\s/g.test(str);
};
