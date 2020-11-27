import { expect } from "chai";
import {
  getTidligereAlternativer,
  brukerHarSvart,
  getSvar,
} from "../../src/utils/moteplanleggerUtils";
import {
  moteIkkeBesvart,
  moteBesvartAlleAlternativer,
  moteBesvartMedNyeAlternativerBesvart,
  moteBesvartMedNyeAlternativerIkkeBesvart,
} from "../mockdata/mockMoteforesporsel";

describe("moteplanleggerUtils", () => {
  describe("getTidligereAlternativer", () => {
    describe('Når innlogget bruker er "Bruker"', () => {
      it("Skal returnere ingen dersom bruker ikke har svart tidligere", () => {
        const res = getTidligereAlternativer(moteIkkeBesvart);
        expect(res).to.deep.equal([]);
      });

      it("Skal returnere alle dersom bruker har svart", () => {
        const res = getTidligereAlternativer(moteBesvartAlleAlternativer);
        expect(res).to.deep.equal(moteBesvartAlleAlternativer.alternativer);
      });

      it("Skal returnere alle dersom bruker har svart på nye alternativer", () => {
        const res = getTidligereAlternativer(
          moteBesvartMedNyeAlternativerBesvart
        );
        expect(res).to.deep.equal(
          moteBesvartMedNyeAlternativerBesvart.alternativer
        );
      });

      it("Skal returnere gamle dersom bruker ikke har svart på nye alternativer", () => {
        const res = getTidligereAlternativer(
          moteBesvartMedNyeAlternativerIkkeBesvart
        );
        // Tidspunkt opprettet før innlogget bruker svarte anses som gamle
        expect(res).to.deep.equal([
          {
            id: 1,
            tid: new Date("2017-03-08T14:04:59.524"),
            created: new Date("2017-02-23T14:04:59.524"),
            sted: "Testveien 2",
            valgt: true,
          },
          {
            id: 2,
            tid: new Date("2017-03-10T14:04:59.524"),
            created: new Date("2017-02-23T14:04:59.524"),
            sted: "Testveien 2",
            valgt: false,
          },
        ]);
      });
    });
  });

  describe("brukerHarSvart", () => {
    it("Skal returnere false hvis created er etter svartidspunkt", () => {
      const created = new Date("2017-02-25T12:57:11.906");
      const svartidspunkt = new Date("2017-02-23T12:57:11.906");
      expect(brukerHarSvart(svartidspunkt, created)).to.be.equal(false);
    });

    it("Skal returnere false hvis svartidspunkt er null", () => {
      const svartidspunkt = null;
      const created = new Date("2017-02-25T12:57:11.906");
      expect(brukerHarSvart(svartidspunkt, created)).to.be.equal(false);
    });

    it("Skal returnere true hvis created er før svartidspunkt", () => {
      const created = new Date("2017-02-23T12:57:11.906");
      const svartidspunkt = new Date("2017-02-25T12:57:11.906");
      expect(brukerHarSvart(svartidspunkt, created)).to.be.equal(true);
    });
  });

  describe("getSvar", () => {
    it('Skal returnere "Ikke svart" hvis svartidspunkt ikke finnes', () => {
      const res = getSvar({}, null);
      expect(res).to.equal("IKKE_SVART");
    });

    it("Skal returnere Ikke svart hvis bruker ikke har svart", () => {
      const created = new Date("2017-02-25T12:57:11.906");
      const svartidspunkt = new Date("2017-02-23T12:57:11.906");
      const res = getSvar({ created }, svartidspunkt);
      expect(res).to.equal("IKKE_SVART");
    });

    it("Skal returnere Passer hvis bruker har svart, og det passer", () => {
      const valgt = true;
      const created = new Date("2017-02-24T12:57:11.906");
      const svartidspunkt = new Date("2017-02-25T12:57:11.906");
      const res = getSvar({ created, valgt }, svartidspunkt);
      expect(res).to.equal("PASSER");
    });

    it("Skal returnere Passer ikke hvis bruker har svart, og det ikke passer", () => {
      const valgt = false;
      const created = new Date("2017-02-24T12:57:11.906");
      const svartidspunkt = new Date("2017-02-25T12:57:11.906");
      const res = getSvar({ created, valgt }, svartidspunkt);
      expect(res).to.equal("PASSER_IKKE");
    });
  });
});
