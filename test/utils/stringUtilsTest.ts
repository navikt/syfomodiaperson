import { describe, expect, it } from "vitest";
import { capitalizeAllWords, formatPhonenumber } from "@/utils/stringUtils";

const expectedCapitalized = "Stevie Ray Vaughan";
const expectedCapitalizedHyphen = "Jean-Luc Picard";

describe("stringUtils", () => {
  it("skal gi alle ord stod forbokstav", () => {
    const name = "stevie ray vaughan";
    expect(capitalizeAllWords(name)).to.equal(expectedCapitalized);
  });

  it("skal håndtere bindestrek", () => {
    const name = "Jean-luc Picard";
    expect(capitalizeAllWords(name)).to.equal(expectedCapitalizedHyphen);
  });

  describe("formatPhonenumber", () => {
    it("skal formatere fra 12345678 til 12 34 56 78", () => {
      const phonenumber = "12345678";
      expect(formatPhonenumber(phonenumber)).to.equal("12 34 56 78");
    });

    it("skal formatere fra +4712345678 til +47 12 34 56 78", () => {
      const phonenumber = "+4712345678";
      expect(formatPhonenumber(phonenumber)).to.equal("+47 12 34 56 78");
    });

    it("returnerer samme nummer om format ikke passer", () => {
      const phonenumber = "123 45 678";
      expect(formatPhonenumber(phonenumber)).to.equal("123 45 678");
    });
  });
});
