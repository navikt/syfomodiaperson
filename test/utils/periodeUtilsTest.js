import chai from "chai";
import chaiDatetime from "chai-datetime";
import sinon from "sinon";
import {
  candidateTilfelleIsConnectedToTilfelle,
  startDateFromLatestActiveTilfelle,
  periodeOverlapperMedPeriode,
  senesteTom,
  tidligsteFom,
  tilfellerFromTilfelleperioder,
} from "@/utils/periodeUtils";
import {
  oppfolgingstilfelleperioderMoreThanOneTilfelleInactive,
  oppfolgingstilfelleperioderOneTilfelleInactive,
  oppfolgingstilfelleperioderWithOneTilfelle,
  oppfolgingstilfelleperioderWithTwoConnectedTilfeller,
  oppfolgingstilfelleperioderWithTwoPerioderInOneTilfelle,
  oppfolgingstilfelleperioderWithTwoUnconnectedTilfeller,
  START_DATE_NEWEST_TILFELLE,
  START_DATE_OLDEST_TILFELLE,
  TODAY,
} from "../mockdata/mockOppfolgingstilfelleperioder";
import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";

chai.use(chaiDatetime);
const expect = chai.expect;

describe("periodeUtils", () => {
  describe("tidligsteFom", () => {
    it("skal returnere den tidligste startdatoen fra en liste med perioder", () => {
      const fom1 = "2019-01-01";
      const fom2 = "2019-02-02";
      const fom3 = "2019-03-03";
      const tom = "2019-05-05";

      const perioder = [
        {
          fom: fom2,
          tom: tom,
        },
        {
          fom: fom3,
          tom: tom,
        },
        {
          fom: fom1,
          tom: tom,
        },
      ];

      const tidligsteStartdato = tidligsteFom(perioder);

      expect(tidligsteStartdato).to.equal(fom1);
    });
  });
  describe("senesteTom", () => {
    it("skal returnere den seneste sluttdatoen fra en liste med perioder", () => {
      const fom = "2019-05-05";
      const tom1 = "2019-01-01";
      const tom2 = "2019-02-02";
      const tom3 = "2019-03-03";

      const perioder = [
        {
          fom: fom,
          tom: tom2,
        },
        {
          fom: fom,
          tom: tom3,
        },
        {
          fom: fom,
          tom: tom1,
        },
      ];

      const senesteSluttdato = senesteTom(perioder);

      expect(senesteSluttdato).to.equal(tom3);
    });
  });
  describe("periodeOverlapperMedPeriode", () => {
    it("Skal gi true hvis to perioder overlapper", () => {
      const periodeA = {
        fom: "2019-01-01",
        tom: "2019-03-03",
      };
      const periodeB = {
        fom: "2019-02-02",
        tom: "2019-04-04",
      };

      const periodeneOverlapper = periodeOverlapperMedPeriode(
        periodeA,
        periodeB
      );

      expect(periodeneOverlapper).to.equal(true);
    });
    it("Skal gi false hvis to perioder ikke overlapper", () => {
      const periodeA = {
        fom: "2019-03-03",
        tom: "2019-04-04",
      };
      const periodeB = {
        fom: "2019-01-01",
        tom: "2019-02-02",
      };

      const periodeneOverlapper = periodeOverlapperMedPeriode(
        periodeA,
        periodeB
      );

      expect(periodeneOverlapper).to.equal(false);
    });
  });

  describe("tilfellerFromTilfelleperioder", () => {
    it("Skal gi en tom liste hvis oppfolgingstilfelleperioder er tom", () => {
      const oppfolgingstilfelleperioder = {};

      const tilfeller = tilfellerFromTilfelleperioder(
        oppfolgingstilfelleperioder
      );

      expect(tilfeller.length).to.equal(0);
    });
    it("Skal gi en tom liste hvis ingen bedrifter har hentet data", () => {
      const oppfolgingstilfelleperioder = {
        555666444: {
          data: [],
        },
      };

      const tilfeller = tilfellerFromTilfelleperioder(
        oppfolgingstilfelleperioder
      );

      expect(tilfeller.length).to.equal(0);
    });
    it("Skal gi riktig tilfelle hvis det bare er én periode", () => {
      const oppfolgingstilfelleperioder = {
        555666444: {
          data: [
            {
              orgnummer: "555666444",
              fom: "2019-06-05",
              tom: "2019-12-11",
              grad: 100,
              aktivitet: "Heihei",
            },
          ],
        },
      };

      const expectedTilfelle = [
        {
          fom: "2019-06-05",
          tom: "2019-12-11",
        },
      ];

      const tilfeller = tilfellerFromTilfelleperioder(
        oppfolgingstilfelleperioder
      );

      expect(tilfeller).to.deep.equal(expectedTilfelle);
    });
    it("Skal gi riktig tilfelle selv om periodene ikke ligger i riktig rekkefølge", () => {
      const oppfolgingstilfelleperioder = {
        555666444: {
          data: [
            {
              orgnummer: "555666444",
              fom: "2019-06-05",
              tom: "2019-12-11",
              grad: 100,
              aktivitet: "Heihei",
            },
            {
              orgnummer: "555666444",
              fom: "2019-01-05",
              tom: "2019-10-11",
              grad: 100,
              aktivitet: "Heihei",
            },
            {
              orgnummer: "555666444",
              fom: "2019-07-05",
              tom: "2019-12-24",
              grad: 100,
              aktivitet: "Heihei",
            },
          ],
        },
      };

      const expectedTilfelle = [
        {
          fom: "2019-01-05",
          tom: "2019-12-24",
        },
      ];

      const tilfeller = tilfellerFromTilfelleperioder(
        oppfolgingstilfelleperioder
      );

      expect(tilfeller).to.deep.equal(expectedTilfelle);
    });
    it("Skal gi en liste med to objekter hvis det er to bedrifter med tilfelleperioder", () => {
      const oppfolgingstilfelleperioder = {
        [VIRKSOMHET_PONTYPANDY.virksomhetsnummer]: {
          data: [
            {
              orgnummer: "922345678",
              fom: "2019-06-07",
              tom: "2019-07-10",
              grad: 100,
              aktivitet: "Heihei",
            },
            {
              orgnummer: "922345678",
              fom: "2019-07-11",
              tom: "2019-08-26",
              grad: 100,
              aktivitet: "Heihei",
            },
          ],
        },
        555666444: {
          data: [
            {
              orgnummer: "555666444",
              fom: "2019-06-05",
              tom: "2019-12-11",
              grad: 100,
              aktivitet: "Heihei",
            },
          ],
        },
      };

      const expectedTilfeller = [
        {
          fom: "2019-06-07",
          tom: "2019-08-26",
        },
        {
          fom: "2019-06-05",
          tom: "2019-12-11",
        },
      ];

      const tilfeller = tilfellerFromTilfelleperioder(
        oppfolgingstilfelleperioder
      );

      expect(tilfeller).to.deep.equal(expectedTilfeller);
    });
  });

  describe("candidateTilfelleIsConnectedToTilfelle", () => {
    it("Should return true if periods overlap", () => {
      const tilfelle = {
        fom: "2020-04-01",
        tom: "2020-04-10",
      };

      const overlappingCandidateTilfelle = {
        fom: "2020-03-20",
        tom: "2020-04-05",
      };

      const isConnected = candidateTilfelleIsConnectedToTilfelle(
        tilfelle,
        overlappingCandidateTilfelle
      );

      expect(isConnected).to.be.true;
    });

    it("Should return true if candidate starts before tilfelle, and ends 16 or less days before", () => {
      const tilfelle = {
        fom: "2020-04-01",
        tom: "2020-04-10",
      };

      const connectedEarlierCandidateTilfelle = {
        fom: "2020-03-20",
        tom: "2020-03-29",
      };

      const isConnected = candidateTilfelleIsConnectedToTilfelle(
        tilfelle,
        connectedEarlierCandidateTilfelle
      );

      expect(isConnected).to.be.true;
    });

    it("Should return false if candidate starts before tilfelle, and ends more than 16 days before", () => {
      const tilfelle = {
        fom: "2020-04-01",
        tom: "2020-04-10",
      };

      const unconnectedEarlierCandidateTilfelle = {
        fom: "2020-03-01",
        tom: "2020-03-10",
      };

      const isConnected = candidateTilfelleIsConnectedToTilfelle(
        tilfelle,
        unconnectedEarlierCandidateTilfelle
      );

      expect(isConnected).to.be.false;
    });

    it("Should return true if candidate starts 16 or less days after after tilfelle", () => {
      const tilfelle = {
        fom: "2020-04-01",
        tom: "2020-04-10",
      };

      const connectedLaterCandidateTilfelle = {
        fom: "2020-04-26",
        tom: "2020-04-30",
      };

      const isConnected = candidateTilfelleIsConnectedToTilfelle(
        tilfelle,
        connectedLaterCandidateTilfelle
      );

      expect(isConnected).to.be.true;
    });

    it("Should return false if candidate starts more than 16 days after after tilfelle", () => {
      const tilfelle = {
        fom: "2020-04-01",
        tom: "2020-04-10",
      };

      const unconnectedLaterCandidateTilfelle = {
        fom: "2020-04-30",
        tom: "2020-05-10",
      };

      const isConnected = candidateTilfelleIsConnectedToTilfelle(
        tilfelle,
        unconnectedLaterCandidateTilfelle
      );

      expect(isConnected).to.be.false;
    });
  });

  describe("startDateFromLatestActiveTilfelle", () => {
    let clock;
    const today = new Date(TODAY);

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Should return earliest start date when only one periode", () => {
      const expectedEarliestDate = START_DATE_NEWEST_TILFELLE;

      const actualEarliestStartDate = startDateFromLatestActiveTilfelle(
        oppfolgingstilfelleperioderWithOneTilfelle
      );

      expect(new Date(actualEarliestStartDate)).to.equalDate(
        new Date(expectedEarliestDate)
      );
    });

    it("Should return earliest start date when multiple perioder in one tilfelle", () => {
      const expectedEarliestDate = START_DATE_OLDEST_TILFELLE;

      const actualEarliestStartDate = startDateFromLatestActiveTilfelle(
        oppfolgingstilfelleperioderWithTwoPerioderInOneTilfelle
      );

      expect(new Date(actualEarliestStartDate)).to.equalDate(
        new Date(expectedEarliestDate)
      );
    });

    it("Should return start date of earliest tilfelle, when it ended less than, or exactly, 16 days before start of newest tilfelle", () => {
      const expectedEarliestDate = START_DATE_OLDEST_TILFELLE;

      const actualEarliestStartDate = startDateFromLatestActiveTilfelle(
        oppfolgingstilfelleperioderWithTwoConnectedTilfeller
      );

      expect(new Date(actualEarliestStartDate)).to.equalDate(
        new Date(expectedEarliestDate)
      );
    });

    it("Should return start date of newest tilfelle, when no other tilfeller connects to it with the 16 day rule", () => {
      const expectedEarliestDate = START_DATE_NEWEST_TILFELLE;

      const actualEarliestStartDate = startDateFromLatestActiveTilfelle(
        oppfolgingstilfelleperioderWithTwoUnconnectedTilfeller
      );

      expect(new Date(actualEarliestStartDate)).to.equalDate(
        new Date(expectedEarliestDate)
      );
    });

    it("Should return null if newest tilfelle is more than 16 days in the past, and there is only one tilfelle", () => {
      const actualEarliestStartDate = startDateFromLatestActiveTilfelle(
        oppfolgingstilfelleperioderOneTilfelleInactive
      );

      expect(actualEarliestStartDate).to.equal(null);
    });

    it("Should return null if newest tilfelle is more than 16 days in the past, and there is more than one tilfelle", () => {
      const actualEarliestStartDate = startDateFromLatestActiveTilfelle(
        oppfolgingstilfelleperioderMoreThanOneTilfelleInactive
      );

      expect(actualEarliestStartDate).to.equal(null);
    });
  });
});
