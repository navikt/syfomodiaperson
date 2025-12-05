import { describe, expect, it } from "vitest";
import {
  hasGjentakendeSykefravar,
  OppfolgingstilfellePersonDTO,
  THREE_YEARS_AGO_IN_MONTHS,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { generateOppfolgingstilfelle } from "../testDataUtils";
import { daysFromToday } from "../testUtils";
import dayjs from "dayjs";

describe("oppfolgingstilfellePersonDTO tests", () => {
  describe("hasGjentakendeSykefravar", () => {
    const tilfellePerson: OppfolgingstilfellePersonDTO = {
      oppfolgingstilfelleList: [],
      personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
      hasGjentakendeSykefravar: null,
    };

    it("is a gjentakende sykefravar if hasGjentakendeSykefravar is true", () => {
      const hasGjentakendeFravar = true;

      expect(
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          hasGjentakendeSykefravar: hasGjentakendeFravar,
        })
      ).to.be.true;
    });

    it("is a gjentakende sykefravar if sick twice adding up to more than 400 days", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.true;
    });

    it("is NOT a gjentakende sykefravar if sick once for more than 400 days ", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-100)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.false;
    });

    it("is NOT a gjentakende sykefravar if 5 short, less than 16 days, sykefravar and one long adding up to more than 100 days", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-400)),
        generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-299)),
        generateOppfolgingstilfelle(daysFromToday(-250), daysFromToday(-240)),
        generateOppfolgingstilfelle(daysFromToday(-200), daysFromToday(-188)),
        generateOppfolgingstilfelle(daysFromToday(-150), daysFromToday(-140)),
        generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(-90)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.false;
    });

    it("is a gjentakende sykefravar if 5 almost short, exactly 16 days, sykefravar and one long adding up to more than 100 days", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-400)),
        generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-285)),
        generateOppfolgingstilfelle(daysFromToday(-250), daysFromToday(-235)),
        generateOppfolgingstilfelle(daysFromToday(-200), daysFromToday(-184)),
        generateOppfolgingstilfelle(daysFromToday(-150), daysFromToday(-135)),
        generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(-85)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.true;
    });

    it("is a gjentakende sykefravar if 5 sykefravar adding up to 101 days", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-481)),
        generateOppfolgingstilfelle(daysFromToday(-450), daysFromToday(-431)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-381)),
        generateOppfolgingstilfelle(daysFromToday(-350), daysFromToday(-331)),
        generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-280)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.true;
    });

    it("is NOT a gjentakende sykefravar if sick twice adding up to more than 400 days and one is old", () => {
      const threeYearsAgo = dayjs(new Date())
        .subtract(THREE_YEARS_AGO_IN_MONTHS, "month")
        .subtract(1, "day")
        .toDate();
      const threeYearsMinus200Days = dayjs(threeYearsAgo)
        .subtract(200, "day")
        .toDate();
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(threeYearsMinus200Days, threeYearsAgo),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.false;
    });

    it("is a gjentakende sykefravar if tilfelle ends less than three years ago", () => {
      const FIVE_YEARS_AGO_IN_MONTHS = 60;
      const fiveYearsAgo = dayjs(new Date())
        .subtract(FIVE_YEARS_AGO_IN_MONTHS, "month")
        .toDate();
      const lessThanThreeYearsAgo = dayjs(new Date())
        .subtract(THREE_YEARS_AGO_IN_MONTHS, "month")
        .add(1, "day")
        .toDate();
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(fiveYearsAgo, lessThanThreeYearsAgo),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
      ];

      expect(
        hasGjentakendeSykefravar({ ...tilfellePerson, oppfolgingstilfelleList })
      ).to.be.true;
    });
  });
});
