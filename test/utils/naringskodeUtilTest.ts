import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EregNaringDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import {
  getStandardForNaring,
  isValidNaring,
  toNaringskodeRequest,
} from "@/utils/naringskodeUtil";

describe("naringskodeUtil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-04T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isValidNaring", () => {
    it.each([
      { period: undefined, expected: true },
      { period: { fom: "2025-09-01" }, expected: true },
      { period: { tom: "2026-11-05" }, expected: true },
      { period: { fom: "2026-11-04", tom: "2026-11-04" }, expected: true },
      { period: { fom: "2026-11-05" }, expected: false },
      { period: { tom: "2026-11-03" }, expected: false },
    ])("validates $period as $expected", ({ period, expected }) => {
      const naring: EregNaringDTO = {
        naeringskode: "62.200",
        bruksperiode: period,
      };

      const isValid = isValidNaring(naring);

      expect(isValid).toBe(expected);
    });
  });

  describe("getStandardForNaring", () => {
    it.each([
      { fom: undefined, expected: null },
      { fom: "1993-12-31T00:00:00.000Z", expected: null },
      { fom: "1994-01-01T00:00:00.000Z", expected: 1994 },
      { fom: "2001-12-31T00:00:00.000Z", expected: 1994 },
      { fom: "2002-01-01T00:00:00.000Z", expected: 2002 },
      { fom: "2008-12-31T00:00:00.000Z", expected: 2002 },
      { fom: "2009-01-01T00:00:00.000Z", expected: 2007 },
      { fom: "2025-08-31T00:00:00.000Z", expected: 2007 },
      { fom: "2025-09-01T00:00:00.000Z", expected: 2025 },
    ])("resolves $fom to $expected", ({ fom, expected }) => {
      const naring: EregNaringDTO = {
        naeringskode: "62.200",
        bruksperiode: { fom: fom },
      };

      const standard = getStandardForNaring(naring);

      expect(standard).toBe(expected);
    });
  });

  describe("toNaringskodeRequest", () => {
    let virksomhet: EregOrganisasjonResponseDTO;

    beforeEach(() => {
      virksomhet = {
        type: "Virksomhet",
        organisasjonDetaljer: {
          naeringer: [
            {
              naeringskode: "62.200",
              bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
            },
          ],
        },
      };
    });

    it.each([
      { type: "Virksomhet" as const },
      { type: "Virksomhet" as const, organisasjonDetaljer: {} },
      {
        type: "Virksomhet" as const,
        organisasjonDetaljer: { naeringer: [] },
      },
    ])(
      "returns no requests when naringer are missing or empty: %j",
      (input) => {
        const requests = toNaringskodeRequest(input);

        expect(requests).toEqual([]);
      },
    );

    it("deduplicates code-and-standard pairs while preserving order and distinct standards", () => {
      virksomhet.organisasjonDetaljer = {
        naeringer: [
          {
            naeringskode: "62.200",
            bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
          },
          {
            naeringskode: "70.200",
            bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
          },
          {
            naeringskode: "62.200",
            bruksperiode: { fom: "2026-01-01T00:00:00.000Z" },
          },
          {
            naeringskode: "62.200",
            bruksperiode: { fom: "2009-01-01T00:00:00.000Z" },
          },
          {
            naeringskode: "62.200",
            bruksperiode: { fom: "2010-01-01T00:00:00.000Z" },
          },
        ],
      };

      const requests = toNaringskodeRequest(virksomhet);

      expect(requests).toEqual([
        { naringskode: "62.200", standard: 2025 },
        { naringskode: "70.200", standard: 2025 },
        { naringskode: "62.200", standard: 2007 },
      ]);
      expect(toNaringskodeRequest(virksomhet)).toEqual(requests);
    });

    it("excludes invalid periods and unknown standards without suppressing later valid duplicates", () => {
      virksomhet.organisasjonDetaljer = {
        naeringer: [
          {
            naeringskode: "62.200",
            bruksperiode: { fom: "2027-01-01T00:00:00.000Z" },
          },
          {
            naeringskode: "62.200",
            bruksperiode: {
              fom: "2025-09-01T00:00:00.000Z",
              tom: "2026-11-03T00:00:00.000Z",
            },
          },
          {
            naeringskode: "62.200",
            bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
          },
          {
            naeringskode: "01.410",
            bruksperiode: { fom: "1993-01-01T00:00:00.000Z" },
          },
          { naeringskode: "71.330" },
        ],
      };

      const requests = toNaringskodeRequest(virksomhet);

      expect(requests).toEqual([{ naringskode: "62.200", standard: 2025 }]);
    });
  });
});
