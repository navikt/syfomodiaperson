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

/**
 * Splitter et telefonnummer som kommer inn på formatet 12345678 til 12 34 56 78 eller +4712345678 til +47 12 34 56 78.
 * @param phonenumber Telefonnummeret som skal formateteres.
 */
export function formatPhonenumber(phonenumber: string): string {
  if (phonenumber.length === 8) {
    return phonenumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  } else if (phonenumber.length === 11) {
    return phonenumber.replace(
      /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5"
    );
  } else {
    return phonenumber;
  }
}
