import { texts, validerVideoLink } from "@/utils/valideringUtils";
import { expect, describe, it } from "vitest";

describe("valideringUtils", () => {
  describe("validerVideoLink", () => {
    it("validate incorrect url format, returns error message", () => {
      const validationMessage = validerVideoLink("https://invalid.url");

      expect(validationMessage).to.equal(texts.invalidVideoLink);
    });
    it("validate correct url format and no whitespace, doesn't return error message", () => {
      const validationMessage = validerVideoLink("https://video.nav.no/abc");

      expect(validationMessage).to.be.undefined;
    });
    it("validate url with whitespace, returns error message", () => {
      const validationMessage = validerVideoLink(
        "https://video.nav.no/abc space"
      );

      expect(validationMessage).to.equal(texts.whiteSpaceInVideoLink);
    });
    it("validate url with whitespace only before and after valid url, doesn't return error message", () => {
      const validationMessage = validerVideoLink(
        "   https://video.nav.no/abc  "
      );

      expect(validationMessage).to.be.undefined;
    });
    it("validate url with both wrong format and whitespace, returns format error message", () => {
      const validationMessage = validerVideoLink(
        "https://invalid.url/abc  space"
      );

      expect(validationMessage).to.equal(texts.invalidVideoLink);
    });
  });
});
