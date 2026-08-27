import { describe, expect, it } from "vitest";
import {
  hasGjentakendeSykefravar,
  harPerioderUtenforOppfolgingstilfelle,
  isPeriodeInnenforOppfolgingstilfelle,
  OppfolgingstilfellePersonDTO,
  THREE_YEARS_AGO_IN_MONTHS,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { generateOppfolgingstilfelle } from "../testDataUtils";
import dayjs from "dayjs";
import { daysFromToday } from "@/utils/datoUtils.ts";

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
        }),
      ).to.be.true;
    });

    it("is a gjentakende sykefravar if sick twice adding up to more than 400 days", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
      ];

      expect(
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
      ).to.be.true;
    });

    it("is NOT a gjentakende sykefravar if sick once for more than 400 days ", () => {
      const oppfolgingstilfelleList = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-100)),
      ];

      expect(
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
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
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
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
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
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
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
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
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
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
        hasGjentakendeSykefravar({
          ...tilfellePerson,
          oppfolgingstilfelleList,
        }),
      ).to.be.true;
    });
  });

  describe("isPeriodeInnenforOppfolgingstilfelle", () => {
    const tilfelle = generateOppfolgingstilfelle(
      new Date("2026-08-01"),
      new Date("2026-12-31"),
    );

    it("er true når hele perioden er innenfor tilfellet", () => {
      expect(
        isPeriodeInnenforOppfolgingstilfelle(
          { fom: new Date("2026-09-01"), tom: new Date("2026-09-10") },
          tilfelle,
        ),
      ).to.be.true;
    });

    it("er false når fom er før tilfellets start", () => {
      expect(
        isPeriodeInnenforOppfolgingstilfelle(
          { fom: new Date("2026-07-25"), tom: new Date("2026-09-10") },
          tilfelle,
        ),
      ).to.be.false;
    });

    it("er false når tom er etter tilfellets slutt", () => {
      expect(
        isPeriodeInnenforOppfolgingstilfelle(
          { fom: new Date("2026-09-01"), tom: new Date("2027-01-10") },
          tilfelle,
        ),
      ).to.be.false;
    });

    it("er true når fom er samme dag som tilfellets start, selv om start har klokkeslett", () => {
      const tilfelleMedKlokkeslett = generateOppfolgingstilfelle(
        new Date("2026-08-01T11:48:00"),
        new Date("2026-12-31T11:48:00"),
      );

      expect(
        isPeriodeInnenforOppfolgingstilfelle(
          { fom: new Date("2026-08-01"), tom: new Date("2026-08-10") },
          tilfelleMedKlokkeslett,
        ),
      ).to.be.true;
    });
  });

  describe("harPerioderUtenforOppfolgingstilfelle", () => {
    const tilfelle = generateOppfolgingstilfelle(
      new Date("2026-08-01"),
      new Date("2026-12-31"),
    );

    it("er false når alle perioder er innenfor tilfellet", () => {
      expect(
        harPerioderUtenforOppfolgingstilfelle(
          [
            { fom: new Date("2026-09-01"), tom: new Date("2026-09-07") },
            { fom: new Date("2026-09-10"), tom: new Date("2026-09-12") },
          ],
          tilfelle,
        ),
      ).to.be.false;
    });

    it("er true når en periode delvis er utenfor tilfellet", () => {
      expect(
        harPerioderUtenforOppfolgingstilfelle(
          [
            { fom: new Date("2026-09-01"), tom: new Date("2026-09-07") },
            { fom: new Date("2026-12-20"), tom: new Date("2027-01-05") },
          ],
          tilfelle,
        ),
      ).to.be.true;
    });

    it("er true når det ikke finnes noe oppfolgingstilfelle", () => {
      expect(
        harPerioderUtenforOppfolgingstilfelle(
          [{ fom: new Date("2026-09-01"), tom: new Date("2026-09-07") }],
          undefined,
        ),
      ).to.be.true;
    });
  });
});
