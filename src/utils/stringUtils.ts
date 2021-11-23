export const firstLetterToUpperCase = (ord: string): string => {
  return ord.charAt(0).toUpperCase() + ord.slice(1);
};

export const capitalizeWord = (word: string): string => {
  return firstLetterToUpperCase(word.toLowerCase());
};
