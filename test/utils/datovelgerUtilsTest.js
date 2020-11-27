import { expect } from "chai";
import {
  fraInputdatoTilJSDato,
  erGyldigDatoformat,
  erGyldigDato,
} from "../../src/utils/datovelgerUtils";

describe("datovelgerUtilsTest", () => {
  describe("erGyldigDatoformat", () => {
    it("Skal returnere true ved 12.02.2017", () => {
      const d = erGyldigDatoformat("12.02.2017");
      expect(d).to.be.equal(true);
    });

    it("Skal returnere false ved dd.mm.yy", () => {
      const d = erGyldigDatoformat("02.01.17");
      expect(d).to.be.equal(false);
    });

    it("Skal returnere false ved aa.bb.cccc", () => {
      const d = erGyldigDatoformat("aa.bb.cccc");
      expect(d).to.be.equal(false);
    });

    it("Skal returnere false ved 02.02.____", () => {
      const d = erGyldigDatoformat("02.02.____");
      expect(d).to.be.equal(false);
    });

    it("Skal returnere false ved 02.0a.1234", () => {
      const d = erGyldigDatoformat("02.02.____");
      expect(d).to.be.equal(false);
    });

    it("Skal returnere true ved 42.01.2020", () => {
      const d = erGyldigDatoformat("42.01.2020");
      expect(d).to.be.equal(true);
    });
  });

  describe("erGyldigDato", () => {
    it('Skal returnere false ved "dd.mm.yy"', () => {
      const d = erGyldigDato("02.01.17");
      expect(d).to.be.equal(false);
    });

    it('Skal returnere true ved "dd.mm.yyyy"', () => {
      const d = erGyldigDato("02.01.2017");
      expect(d).to.be.equal(true);
    });

    it("Skal returnere false ved ugyldige datoer", () => {
      const d = erGyldigDato("31.11.2017");
      expect(d).to.be.equal(false);
    });
  });

  describe("fraInputdatoTilJSDato", () => {
    it("Skal håndtere dd.mm.åååå", () => {
      const dato = "12.02.2017";
      const res = fraInputdatoTilJSDato(dato);
      expect(res.getTime()).to.equal(new Date("2017-02-12").getTime());
    });

    it("Skal håndtere dd.mm.åå", () => {
      const dato = "12.02.17";
      const res = fraInputdatoTilJSDato(dato);
      expect(res.getTime()).to.equal(new Date("2017-02-12").getTime());
    });
  });
});
