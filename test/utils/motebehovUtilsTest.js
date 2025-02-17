import { describe, expect, it } from "vitest";
import { hentSistBehandletMotebehov } from "@/utils/motebehovUtils";

describe("motebehovUtils", () => {
  describe("hentSistBehandletMotebehov", () => {
    it("Returnerer ingenting om det er ingen motebehov", () => {
      expect(hentSistBehandletMotebehov([])).to.be.undefined;
    });
    it("Returnerer første motebehov i lista når ingen er behandlet", () => {
      const motebehovUbehandlet1 = {
        behandletTidspunkt: null,
      };
      const motebehovUbehandlet2 = {
        behandletTidspunkt: null,
      };
      expect(
        hentSistBehandletMotebehov([motebehovUbehandlet1, motebehovUbehandlet2])
      ).to.be.deep.equal(motebehovUbehandlet1);
    });
    it("Returnerer motebehov med siste behandlet tidspunkt", () => {
      const motebehovBehandlet1 = {
        behandletTidspunkt: "2021-04-03T15:18:24.000Z",
      };
      const motebehovBehandlet2 = {
        behandletTidspunkt: "2021-04-08T15:18:24.000Z",
      };
      expect(
        hentSistBehandletMotebehov([motebehovBehandlet1, motebehovBehandlet2])
      ).to.be.deep.equal(motebehovBehandlet2);
    });
  });
});
