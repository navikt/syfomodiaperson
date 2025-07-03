import { beforeEach, describe, expect, it } from "vitest";
import { KJOENN } from "@/konstanter";
import { hentBrukersKjoennFraFnr } from "@/components/personkort/PersonkortHeader/KjonnIkon";
import { hentBrukersAlderFraFnr } from "@/components/personkort/PersonkortHeader/NavnHeader";
import { formaterFnr } from "@/utils/fnrUtils";

describe("fnrUtils", () => {
  describe("hentBrukersKjoennFraFnr", () => {
    it("Skal returnere kvinne, om 3. individsiffer er partall", () => {
      expect(hentBrukersKjoennFraFnr("01019900200")).to.equal(KJOENN.KVINNE);
    });

    it("Skal returnere mann, om 3. individsiffer er oddetall", () => {
      expect(hentBrukersKjoennFraFnr("01019900100")).to.equal(KJOENN.MANN);
    });
  });

  describe("hentBrukersAlderFraFnr", () => {
    let dagensDato;

    beforeEach(() => {
      dagensDato = new Date();
    });

    const foedselsaar = 1958;
    const hentFnrFraDato = (dato) => {
      let dag = dato.getDate().toString();
      dag = dag.length === 1 ? `0${dag}` : dag;
      let mnd = (dato.getMonth() + 1).toString();
      mnd = mnd.length === 1 ? `0${mnd}` : mnd;
      const aar = dato.getFullYear().toString().substring(2, 4);
      return `${dag + mnd + aar}33818`;
    };

    it("Skal returnere rett brukers alder, om bruker har hatt foedselsdag", () => {
      const foedselsDatoPassert = new Date();
      foedselsDatoPassert.setFullYear(foedselsaar);
      const fnrFoedselsDatoPassert = hentFnrFraDato(foedselsDatoPassert);
      const alder =
        dagensDato.getFullYear() - foedselsDatoPassert.getFullYear();

      expect(hentBrukersAlderFraFnr(fnrFoedselsDatoPassert)).to.equal(alder);
    });

    it("Skal returnere rett brukers alder, om bruker ikke har hatt foedselsdag", () => {
      const foedselsdatoIkkePassert = new Date();
      foedselsdatoIkkePassert.setFullYear(foedselsaar);
      foedselsdatoIkkePassert.setTime(
        foedselsdatoIkkePassert.getTime() + 24 * 60 * 60 * 1000
      );
      const fnrFoedselsDatoIkkePassert = hentFnrFraDato(
        foedselsdatoIkkePassert
      );
      const alder =
        dagensDato.getFullYear() - foedselsdatoIkkePassert.getFullYear() - 1;

      expect(hentBrukersAlderFraFnr(fnrFoedselsDatoIkkePassert)).to.equal(
        alder
      );
    });
  });

  describe("formaterFnr", () => {
    it("Skal formatere fnr", () => {
      expect(formaterFnr("12121233333")).to.equal("121212 33333");
    });
  });
});
