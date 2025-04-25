import { describe, expect, it } from "vitest";
import { hentSistBehandletMotebehov } from "@/utils/motebehovUtils";
import {
  meldtMotebehovArbeidstakerBehandletMock,
  svartJaMotebehovArbeidstakerUbehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";

describe("motebehovUtils", () => {
  describe("hentSistBehandletMotebehov", () => {
    it("Returnerer ingenting om det er ingen motebehov", () => {
      expect(hentSistBehandletMotebehov([])).to.be.undefined;
    });
    it("Returnerer ingen motebehov i lista når ingen er behandlet", () => {
      const motebehovUbehandlet1 = {
        ...svartJaMotebehovArbeidstakerUbehandletMock,
        behandletTidspunkt: null,
      };
      const motebehovUbehandlet2 = {
        ...svartJaMotebehovArbeidstakerUbehandletMock,
        behandletTidspunkt: null,
      };
      expect(
        hentSistBehandletMotebehov([motebehovUbehandlet1, motebehovUbehandlet2])
      ).to.be.undefined;
    });
    it("Returnerer motebehov med siste behandlet tidspunkt", () => {
      const motebehovBehandlet1 = {
        ...meldtMotebehovArbeidstakerBehandletMock(),
        behandletTidspunkt: new Date("2021-04-03T15:18:24.000Z"),
      };
      const motebehovBehandlet2 = {
        ...meldtMotebehovArbeidstakerBehandletMock(),
        behandletTidspunkt: new Date("2021-04-08T15:18:24.000Z"),
      };
      expect(
        hentSistBehandletMotebehov([motebehovBehandlet1, motebehovBehandlet2])
      ).to.be.deep.equal(motebehovBehandlet2);
    });
  });
});
