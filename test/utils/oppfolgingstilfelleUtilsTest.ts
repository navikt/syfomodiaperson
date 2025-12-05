import { describe, expect, it } from "vitest";
import { sortByDescendingStart } from "@/utils/oppfolgingstilfelleUtils";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { VIRKSOMHET_BRANNOGBIL } from "@/mocks/common/mockConstants";

describe("OppfolgingstilfelleUtils", () => {
  describe("sortByDescendingStart", () => {
    it("return empty list if input is empty", () => {
      const oppfolgingstilfelleList: OppfolgingstilfelleDTO[] = [];

      const sortedTilfeller = sortByDescendingStart(oppfolgingstilfelleList);

      expect(sortedTilfeller.length).to.be.equal(0);
    });

    it("return list with tilfelle with latest start first", () => {
      const earliestStart = new Date("2023-01-01");
      const latestStart = new Date("2023-02-02");
      const oppfolgingstilfelleList: OppfolgingstilfelleDTO[] = [
        {
          arbeidstakerAtTilfelleEnd: true,
          start: earliestStart,
          end: new Date("2023-02-01"),
          antallSykedager: 32,
          varighetUker: 4,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
        {
          arbeidstakerAtTilfelleEnd: true,
          start: latestStart,
          end: new Date("2023-03-01"),
          antallSykedager: 28,
          varighetUker: 8,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
      ];

      const sortedTilfeller = sortByDescendingStart(oppfolgingstilfelleList);

      expect(sortedTilfeller[0].start).to.be.equal(latestStart);
    });

    it("return list with tilfelle with latest end first if both tilfeller start at the same date", () => {
      const start = new Date("2023-01-01");
      const earliestEnd = new Date("2023-02-01");
      const earliestVarighet = 4;
      const latestEnd = new Date("2023-03-02");
      const latestVarighet = 8;
      const tilfeller: OppfolgingstilfelleDTO[] = [
        {
          arbeidstakerAtTilfelleEnd: true,
          start: start,
          end: latestEnd,
          antallSykedager: 61,
          varighetUker: latestVarighet,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
        {
          arbeidstakerAtTilfelleEnd: true,
          start: start,
          end: earliestEnd,
          antallSykedager: 32,
          varighetUker: earliestVarighet,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
      ];

      const sortedTilfeller = sortByDescendingStart(tilfeller);

      expect(sortedTilfeller[0].end).to.be.equal(latestEnd);
    });
  });
});
