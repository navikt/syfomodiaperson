import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addWeeks,
  getAbsoluteCalendarDaysBetween,
  isToday,
  isNotToday,
  getWeeksBetween,
  isExpired,
  getNonNegativeWholeMonthsBetween,
  formatShortDate,
  formatReadableDate,
  formatDateWithMonthName,
  formatDateTime,
  formatDateTimeWithComma,
  formatDateWithWeekdayAndMonthName,
  formatDateTimeWithWeekday,
  formatNumericDate,
  formatDateRangeWithYear,
  formatNumericDateRange,
  toDate,
  toDateOrInvalid,
  formatShortDateOrUndefined,
  formatTime,
} from "@/utils/datoUtils";
import { Malform } from "@/context/malform/MalformContext";

describe("datoUtils", () => {
  describe("formatTime", () => {
    it("Skal vise klokkeslett på riktig format", () => {
      const d = formatTime(new Date(2017, 4, 3, 9, 0));
      expect(d).to.equal("09.00");
    });
  });

  describe("formatShortDate", () => {
    it("Skal konvertere dato fra rest til rett format", () => {
      const restDato = "2017-02-01";
      const dato = formatShortDate(restDato);
      expect(dato).to.equal("01.02.2017");
    });
  });

  describe("formatReadableDate", () => {
    it("Skal konvertere dato fra rest til rett format", () => {
      const restDato = "2017-02-01";
      const dato = formatReadableDate(restDato);
      expect(dato).to.equal("1. februar 2017");
    });
  });
  describe("formatDateWithWeekdayAndMonthName", () => {
    it("Skal gi en string med dato, ukedag, månednavn, og år", () => {
      const restDato = "2019-03-11";
      const dato = formatDateWithWeekdayAndMonthName(restDato);
      expect(dato).to.equal("Mandag 11. mars 2019");
    });
  });
  describe("formatDateTimeWithWeekday", () => {
    it("Skal gi en string med dato, ukedag, månednavn, år og klokkeslett", () => {
      const dato = formatDateTimeWithWeekday("2021-06-04T09:34:55.422796");
      expect(dato).to.equal("Fredag 4. juni 2021 kl. 09.34");
    });
  });
  describe("formatDateTimeWithComma", () => {
    it("Skal gi en string med dato, månednavn, år og klokkeslett med komma foran klokkeslett", () => {
      const dato = formatDateTimeWithComma("2021-06-04T09:34:55.422796");
      expect(dato).to.equal("4. juni 2021, kl. 09.34");
    });
  });
  describe("formatNumericDate", () => {
    it("Skal gi en string med dato, måned og år, skilt av punktum, uten dag- eller månednavn", () => {
      const restDato = "2019-03-11";
      const dato = formatNumericDate(restDato);
      expect(dato).to.equal("11.03.2019");
    });
  });
  describe("formatNumericDateRange", () => {
    it("Skal gi en string med periode der begge datoer har dato, måned og år, skilt av punktum, uten dag- eller månednavn", () => {
      const restDatoFom = "2019-03-11";
      const restDatoTom = "2019-10-02";
      const periode = formatNumericDateRange(restDatoFom, restDatoTom);
      expect(periode).to.equal("11.03.2019 - 02.10.2019");
    });
  });

  describe("getAbsoluteCalendarDaysBetween", () => {
    it("Skal gi antall dager mellom to datoer", () => {
      const restDatoFom = new Date("2019-03-11");
      const restDatoTom = new Date("2019-03-15");
      const antallDager = getAbsoluteCalendarDaysBetween(
        restDatoFom,
        restDatoTom,
      );
      expect(antallDager).to.equal(4);
    });

    it("gir 0 dager hvis start og slutt er samme dato", () => {
      const restDatoFom = new Date("2019-01-01");
      const restDatoTom = new Date("2019-01-01");
      const antallDager = getAbsoluteCalendarDaysBetween(
        restDatoFom,
        restDatoTom,
      );
      expect(antallDager).to.equal(0);
    });
  });

  describe("isToday", () => {
    it("Skal returnere true om en dato er i dag", () => {
      const dato = new Date();
      expect(isToday(dato)).to.equal(true);
    });
    it("Skal returnere false om en dato ikke er i dag", () => {
      const dato = new Date("2019-01-01");
      expect(isToday(dato)).to.equal(false);
    });
  });

  describe("isNotToday", () => {
    it("Skal returnere true om en dato ikke er i dag", () => {
      const dato = new Date("2019-01-01");
      expect(isNotToday(dato)).to.equal(true);
    });
    it("Skal returnere false om en dato er i dag", () => {
      const dato = new Date();
      expect(isNotToday(dato)).to.equal(false);
    });
  });

  describe("getNonNegativeWholeMonthsBetween", () => {
    it("finner antall måneder mellom Dates som har samme måned", () => {
      const date1 = new Date("2020-10-10");
      const date2 = new Date("2020-10-10");

      const manederMellom = getNonNegativeWholeMonthsBetween(date1, date2);
      expect(manederMellom).to.equal(0);
    });

    it("finner antall måneder mellom to Dates med én måned mellom", () => {
      const date1 = new Date("2020-10-10");
      const date2 = new Date("2020-11-10");

      const manederMellom = getNonNegativeWholeMonthsBetween(date1, date2);
      expect(manederMellom).to.equal(1);
    });

    it("finner antall måneder mellom når Date2 er før Date1", () => {
      const date1 = new Date("2020-11-10");
      const date2 = new Date("2020-10-10");

      const manederMellom = getNonNegativeWholeMonthsBetween(date1, date2);
      expect(manederMellom).to.equal(0);
    });

    it("finner antall måneder mellom når Date1 er fra året før", () => {
      const date1 = new Date("2019-11-10");
      const date2 = new Date("2020-02-10");

      const manederMellom = getNonNegativeWholeMonthsBetween(date1, date2);
      expect(manederMellom).to.equal(3);
    });

    it("finner antall måneder mellom Dates når date2 sin dag er mindre enn date1", () => {
      const date1 = new Date("2020-10-30");
      const date2 = new Date("2020-12-01");

      const manederMellom = getNonNegativeWholeMonthsBetween(date1, date2);
      expect(manederMellom).to.equal(1);
    });

    it("finner antall måneder mellom Dates når date2 sin dag er etter date1", () => {
      const date1 = new Date("2020-10-10");
      const date2 = new Date("2020-12-11");

      const manederMellom = getNonNegativeWholeMonthsBetween(date1, date2);
      expect(manederMellom).to.equal(2);
    });
  });

  describe("toDateOrInvalid", () => {
    it("converts valid input to a Date", () => {
      const input = "2024-03-12";

      const date = toDateOrInvalid(input);

      expect(date.getTime()).to.equal(new Date(2024, 2, 12).getTime());
    });

    it.each(["", "invalid", "2024-02-30"])(
      "returns Invalid Date for invalid input: %s",
      (input) => {
        const date = toDateOrInvalid(input);

        expect(date).to.be.instanceOf(Date);
        expect(Number.isNaN(date.getTime())).to.equal(true);
      },
    );
  });

  describe("addWeeks", () => {
    it("legg til uker på en dato", () => {
      const date1 = new Date("2022-01-01");
      const date2 = new Date("2022-07-02");

      const dateWithAddedWeeks = addWeeks(date1, 26);
      expect(dateWithAddedWeeks.getDate()).to.equal(date2.getDate());
    });
  });

  describe("Uker mellom datoer", () => {
    it("Runder ned når det er 7 uker og 6 dager mellom to datoer", () => {
      const date1 = new Date("2023-07-31");
      const date2 = new Date("2023-09-24");

      const weeks = getWeeksBetween(date1, date2);
      expect(weeks).to.equal(7);
    });
  });

  describe("edge cases", () => {
    describe("tidssoner", () => {
      const tidssoner = [
        { tidssone: "Europe/Oslo", offsetIJanuar: -60 },
        { tidssone: "UTC", offsetIJanuar: 0 },
        { tidssone: "America/New_York", offsetIJanuar: 300 },
        { tidssone: "Pacific/Kiritimati", offsetIJanuar: -840 },
      ];
      let opprinneligTidssone: string | undefined;

      beforeEach(() => {
        opprinneligTidssone = process.env.TZ;
      });

      afterEach(() => {
        process.env.TZ = opprinneligTidssone;
      });

      it.each(tidssoner)(
        "viser samme kalenderdato i $tidssone",
        ({ tidssone, offsetIJanuar }) => {
          process.env.TZ = tidssone;

          const offset = new Date(2024, 0, 1).getTimezoneOffset();
          const datoUtenKlokkeslett = formatShortDateOrUndefined("2019-03-11");
          const localDateTime = formatDateTime("2021-06-04T23:30:00.123456");
          const rettEtterMidnatt = formatShortDateOrUndefined(
            new Date(2024, 0, 15, 0, 30),
          );

          expect(offset).to.equal(offsetIJanuar);
          expect(datoUtenKlokkeslett).to.equal("11.03.2019");
          expect(localDateTime).to.equal("4. juni 2021 kl. 23.30");
          expect(rettEtterMidnatt).to.equal("15.01.2024");
        },
      );
    });

    it("viser UTC-tidspunkt i lokal tid", () => {
      const utcTidspunkt = "2020-08-10T22:00:00Z";

      const dato = formatShortDateOrUndefined(utcTidspunkt);
      const klokkeslett = formatTime(utcTidspunkt);

      expect(dato).to.equal("11.08.2020");
      expect(klokkeslett).to.equal("00.00");
    });

    it("tolker tidspunkt med offset", () => {
      const dato = toDate("2024-01-01T10:00:00+01:00");

      expect(dato?.getTime()).to.equal(Date.UTC(2024, 0, 1, 9, 0));
    });

    it.each([null, undefined, "", "tull", "2024-02-30"])(
      "gir tom verdi for ugyldig eller manglende dato: %s",
      (verdi) => {
        expect(formatShortDateOrUndefined(verdi)).to.equal(undefined);
        expect(formatTime(verdi)).to.equal(null);
        expect(formatDateWithMonthName(verdi)).to.equal("");
        expect(toDate(verdi)).to.equal(undefined);
      },
    );

    it("formaterer periode med lokale datoer rundt midnatt", () => {
      const fom = new Date(2024, 2, 1, 0, 30);
      const tom = new Date(2024, 2, 15, 23, 30);

      const periode = formatDateRangeWithYear(fom, tom);

      expect(periode).to.equal("1. – 15. mars 2024");
    });

    it("bruker nynorske ukedager", () => {
      const tysdag = formatDateWithWeekdayAndMonthName(
        "2024-03-12",
        Malform.NYNORSK,
      );
      const sundag = formatDateWithWeekdayAndMonthName(
        "2024-03-10",
        Malform.NYNORSK,
      );

      expect(tysdag).to.equal("Tysdag 12. mars 2024");
      expect(sundag).to.equal("Sundag 10. mars 2024");
    });

    it("teller kalenderdager uavhengig av klokkeslett", () => {
      const sentPaKvelden = new Date(2024, 0, 1, 23, 0);
      const tidligNesteDag = new Date(2024, 0, 2, 1, 0);

      const dager = getAbsoluteCalendarDaysBetween(
        sentPaKvelden,
        tidligNesteDag,
      );

      expect(dager).to.equal(1);
    });

    it("teller ett døgn over overgang til sommertid og vintertid", () => {
      const overSommertid = getAbsoluteCalendarDaysBetween(
        new Date(2024, 2, 31),
        new Date(2024, 3, 1),
      );
      const overVintertid = getAbsoluteCalendarDaysBetween(
        new Date(2024, 9, 27),
        new Date(2024, 9, 28),
      );

      expect(overSommertid).to.equal(1);
      expect(overVintertid).to.equal(1);
    });

    it("handles month-end dates in getNonNegativeWholeMonthsBetween", () => {
      const tilSisteDagIFebruar = getNonNegativeWholeMonthsBetween(
        "2024-01-31",
        "2024-02-29",
      );
      const tilNestSisteDagIFebruar = getNonNegativeWholeMonthsBetween(
        "2024-01-31",
        "2024-02-28",
      );

      expect(tilSisteDagIFebruar).to.equal(1);
      expect(tilNestSisteDagIFebruar).to.equal(0);
    });

    describe("forhåndsvarsel", () => {
      beforeEach(() => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date(2024, 2, 31, 0, 30));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it("er utløpt først dagen etter fristen", () => {
        const fristIdag = isExpired(new Date(2024, 2, 31, 0, 0));
        const fristIgar = isExpired(new Date(2024, 2, 30, 23, 59));

        expect(fristIdag).to.equal(false);
        expect(fristIgar).to.equal(true);
      });
    });
  });
});
