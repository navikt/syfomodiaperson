import { validerSkjemaTekster } from "@/utils/valideringUtils";
import { expect } from "chai";
import { getTooLongText, maxLengthErrorMessage } from "../testUtils";

type Tekster = {
  tekst: string;
};

describe("valideringUtils", () => {
  describe("validerTekster", () => {
    it("validerer required tekst", () => {
      const feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: "",
          maxLength: 100,
          missingRequiredMessage: "Missing",
        },
      });
      expect(feil).to.deep.equal({
        tekst: "Missing",
      });
    });
    it("validerer maks-lengde på optional tekst", () => {
      let feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: "Hei",
          maxLength: 100,
        },
      });
      expect(feil).to.deep.equal({
        tekst: undefined,
      });

      const maxLength = 100;
      const tooLongText = getTooLongText(maxLength);
      feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: tooLongText,
          maxLength: maxLength,
        },
      });

      expect(feil).to.deep.equal({
        tekst: maxLengthErrorMessage(maxLength),
      });
    });
    it("validerer maks-lengde på required tekst", () => {
      let feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: "Hei",
          maxLength: 100,
          missingRequiredMessage: "Missing",
        },
      });
      expect(feil).to.deep.equal({
        tekst: undefined,
      });

      const maxLength = 100;
      const tooLongText = getTooLongText(maxLength);
      feil = validerSkjemaTekster<Tekster>({
        tekst: {
          value: tooLongText,
          maxLength: maxLength,
          missingRequiredMessage: "Missing",
        },
      });

      expect(feil).to.deep.equal({
        tekst: maxLengthErrorMessage(maxLength),
      });
    });
  });
});
