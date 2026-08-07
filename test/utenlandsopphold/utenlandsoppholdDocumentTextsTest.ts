import { describe, expect, it } from "vitest";
import {
  getAvslagTexts,
  getDelvisInnvilgetTexts,
  getInnvilgetTexts,
} from "@/data/utenlandsopphold/utenlandsoppholdDocumentTexts.ts";
import { Periode } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";

const soknadDato = new Date("2026-05-15");

const enPeriode: Periode[] = [
  { fom: new Date("2026-06-01"), tom: new Date("2026-06-07") },
];

const flerePerioder: Periode[] = [
  { fom: new Date("2026-06-01"), tom: new Date("2026-06-07") },
  { fom: new Date("2026-06-10"), tom: new Date("2026-06-12") },
];

describe("utenlandsoppholdDocumentTexts", () => {
  describe("getInnvilgetTexts", () => {
    it("formaterer en enkelt innvilget periode", () => {
      const texts = getInnvilgetTexts({
        soknadDato,
        innvilgedePerioder: enPeriode,
      });

      expect(texts.tittel).to.equal(
        "Vedtak om innvilgelse av utenlandsopphold",
      );
      expect(texts.innvilget.intro).to.contain(
        "01.06.2026 til og med 07.06.2026",
      );
    });

    it("formaterer flere innvilgede perioder adskilt med 'og'", () => {
      const texts = getInnvilgetTexts({
        soknadDato,
        innvilgedePerioder: flerePerioder,
      });

      expect(texts.innvilget.intro).to.contain(
        "01.06.2026 til og med 07.06.2026, og 10.06.2026 til og med 12.06.2026",
      );
    });
  });

  describe("getAvslagTexts", () => {
    it("viser avslåtte perioder, ikke innvilgede perioder, i introteksten", () => {
      const texts = getAvslagTexts({
        soknadDato,
        avslattePerioder: flerePerioder,
        begrunnelse: "En begrunnelse",
      });

      expect(texts.tittel).to.equal("Vedtak om avslag på utenlandsopphold");
      expect(texts.avslag.intro).to.contain(
        "01.06.2026 til og med 07.06.2026, og 10.06.2026 til og med 12.06.2026",
      );
    });
  });

  describe("getDelvisInnvilgetTexts", () => {
    it("viser både innvilgede og avslåtte perioder i introteksten", () => {
      const innvilgedePerioder: Periode[] = [
        { fom: new Date("2026-06-01"), tom: new Date("2026-06-05") },
      ];
      const avslattePerioder: Periode[] = [
        { fom: new Date("2026-06-06"), tom: new Date("2026-06-07") },
      ];

      const texts = getDelvisInnvilgetTexts({
        soknadDato,
        innvilgedePerioder,
        avslattePerioder,
        begrunnelse: "En begrunnelse",
      });

      expect(texts.tittel).to.equal(
        "Vedtak om delvis innvilgelse av utenlandsopphold",
      );
      expect(texts.delvisInnvilget.intro).to.contain(
        "01.06.2026 til og med 05.06.2026",
      );
      expect(texts.delvisInnvilget.intro).to.contain(
        "06.06.2026 til og med 07.06.2026",
      );
    });
  });
});
