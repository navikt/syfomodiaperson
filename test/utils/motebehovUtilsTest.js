import { describe, expect, it } from "vitest";
import {
  erMotebehovBehandlet,
  hentSistBehandletMotebehov,
} from "@/utils/motebehovUtils";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants";

describe("motebehovUtils", () => {
  describe("erMotebehovBehandlet", () => {
    const motebehovMedBehovBehandlet = {
      motebehovSvar: {
        harMotebehov: true,
      },
      behandletTidspunkt: new Date(),
      behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
    };
    const motebehovMedBehovUbehandlet = {
      motebehovSvar: {
        harMotebehov: true,
      },
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };
    const motebehovUtenBehovUbehandlet = {
      motebehovSvar: {
        harMotebehov: false,
      },
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };

    describe("med motebehovsvar", () => {
      it("er true, med 1 behandlet svar med behov", () => {
        const exp = erMotebehovBehandlet([motebehovMedBehovBehandlet]);
        expect(exp).to.equal(true);
      });

      it("er false, med 1 ubehandlet svar med behov", () => {
        const exp = erMotebehovBehandlet([motebehovMedBehovUbehandlet]);
        expect(exp).to.equal(false);
      });

      it("er true, med 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([motebehovUtenBehovUbehandlet]);
        expect(exp).to.equal(true);
      });

      it("er false, med 1 behandlet svar med behov, 1 ubehandlet svar med behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovBehandlet,
          motebehovMedBehovUbehandlet,
        ]);
        expect(exp).to.equal(false);
      });

      it("er false, med 1 ubehandlet svar med behov og 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovUbehandlet,
          motebehovUtenBehovUbehandlet,
        ]);
        expect(exp).to.equal(false);
      });

      it("er true, med 1 behandlet svar med behov og 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovBehandlet,
          motebehovUtenBehovUbehandlet,
        ]);
        expect(exp).to.equal(true);
      });

      it("er false, med 1 behandlet svar med behov, 1 ubehandlet svar med behov, 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovBehandlet,
          motebehovMedBehovUbehandlet,
          motebehovUtenBehovUbehandlet,
        ]);
        expect(exp).to.equal(false);
      });
    });

    describe("uten motebehov", () => {
      it("er true, om det er ingen motebehov", () => {
        const exp = erMotebehovBehandlet([]);
        expect(exp).to.equal(true);
      });
    });
  });

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
