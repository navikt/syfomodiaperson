import { describe, expect, it } from "vitest";
import { formaterFnr } from "@/utils/fnrUtils";

describe("fnrUtils", () => {
  describe("formaterFnr", () => {
    it("Skal formatere fnr", () => {
      expect(formaterFnr("12121233333")).to.equal("121212 33333");
    });
  });
});
