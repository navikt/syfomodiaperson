import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EregGyldighetsperiodeDTO,
  EregJuridiskEnhetDTO,
  EregOrganisasjonsleddDTO,
  EregVirksomhetDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import {
  enrichWithOverordnedeEnheter,
  getOverordnetEnhetOrganisasjonsnummer,
} from "@/utils/virksomhetUtil";

describe("virksomhetUtil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-11-24T12:00:00").toDate());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getVirksomhetsnavn", () => {
    it("prefers redigertnavn over navnelinje1", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        navn: { redigertnavn: "Redigert", navnelinje1: "Opprinnelig" },
      };

      expect(getVirksomhetsnavn(virksomhet)).toBe("Redigert");
    });

    it("falls back to navnelinje1 and safely handles a missing name", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        navn: { navnelinje1: "Opprinnelig" },
      };

      expect(getVirksomhetsnavn(virksomhet)).toBe("Opprinnelig");
      expect(getVirksomhetsnavn({ type: "Virksomhet" })).toBe("");
    });
  });

  describe("getOverordnetEnhetOrganisasjonsnummer", () => {
    it.each<{ period?: EregGyldighetsperiodeDTO; expected: string | null }>([
      { period: undefined, expected: "200" },
      { period: { fom: "2026-11-24" }, expected: "200" },
      { period: { tom: "2026-11-24" }, expected: "200" },
      {
        period: { fom: "2026-11-24", tom: "2026-11-24" },
        expected: "200",
      },
      { period: { fom: "2026-11-25" }, expected: null },
      { period: { tom: "2026-11-23" }, expected: null },
    ])("selects $period as $expected", ({ period, expected }) => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        inngaarIJuridiskEnheter: [
          { organisasjonsnummer: "200", gyldighetsperiode: period },
        ],
      };

      const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBe(expected);
    });

    it.each<EregVirksomhetDTO>([
      { type: "Virksomhet" },
      { type: "Virksomhet", inngaarIJuridiskEnheter: [] },
      { type: "Virksomhet", inngaarIJuridiskEnheter: [{}] },
    ])("returns null when no parent number exists: %j", (virksomhet) => {
      const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBeNull();
    });

    it("prefers the latest current reference and ignores references without a number", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        inngaarIJuridiskEnheter: [
          { organisasjonsnummer: "200" },
          {
            organisasjonsnummer: "201",
            gyldighetsperiode: { fom: "2026-11-24" },
          },
          {
            organisasjonsnummer: "202",
            gyldighetsperiode: { fom: "2026-11-25" },
          },
          { gyldighetsperiode: { fom: "2026-11-24" } },
        ],
      };

      const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBe("201");
    });

    it("selects the nearest section even when a direct legal reference and higher sections exist", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
        bestaarAvOrganisasjonsledd: [
          {
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "300",
              organisasjonsleddOver: [
                {
                  organisasjonsledd: {
                    type: "Organisasjonsledd",
                    organisasjonsnummer: "400",
                  },
                },
              ],
              inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
            },
          },
        ],
      };

      const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBe("300");
    });

    it.each<{ period?: EregGyldighetsperiodeDTO; expected: string }>([
      { period: undefined, expected: "300" },
      { period: { fom: "2026-11-24", tom: "2026-11-24" }, expected: "300" },
      { period: { fom: "2026-11-25" }, expected: "200" },
      { period: { tom: "2026-11-23" }, expected: "200" },
    ])(
      "uses the section relationship's validity period: $period",
      ({ period, expected }) => {
        const virksomhet: EregVirksomhetDTO = {
          type: "Virksomhet",
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
          bestaarAvOrganisasjonsledd: [
            {
              gyldighetsperiode: period,
              organisasjonsledd: {
                type: "Organisasjonsledd",
                organisasjonsnummer: "300",
              },
            },
          ],
        };

        const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);

        expect(nummer).toBe(expected);
      },
    );

    it("selects the latest current section and leaves the hierarchy unchanged", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        bestaarAvOrganisasjonsledd: [
          {
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "300",
            },
          },
          {
            gyldighetsperiode: { fom: "2026-11-24" },
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "301",
            },
          },
          {
            gyldighetsperiode: { fom: "2026-11-25" },
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "302",
            },
          },
          { gyldighetsperiode: { fom: "2026-11-24" } },
        ],
      };
      const original = structuredClone(virksomhet);

      const nummer = getOverordnetEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBe("301");
      expect(virksomhet).toEqual(original);
    });

    it("uses organisasjonsleddOver when the organisation itself is a section", () => {
      const organisasjonsledd: EregOrganisasjonsleddDTO = {
        type: "Organisasjonsledd",
        organisasjonsnummer: "300",
        inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
        organisasjonsleddOver: [
          {
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "400",
            },
          },
        ],
      };

      const nummer = getOverordnetEnhetOrganisasjonsnummer(organisasjonsledd);

      expect(nummer).toBe("400");
    });
  });

  describe("enrichWithOverordnedeEnheter", () => {
    it("joins by number regardless of order, sharing legal entities without changing the inputs", () => {
      const virksomheter: EregVirksomhetDTO[] = ["200", "201", "200"].map(
        (nummer, index) => ({
          type: "Virksomhet",
          organisasjonsnummer: String(index),
          navn: { navnelinje1: `Virksomhet ${index}` },
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: nummer }],
        }),
      );
      const overordnedeEnheter: EregJuridiskEnhetDTO[] = ["201", "200"].map(
        (nummer) => ({
          type: "JuridiskEnhet",
          organisasjonsnummer: nummer,
          juridiskEnhetDetaljer: { sektorkode: "2100" },
        }),
      );

      const enriched = enrichWithOverordnedeEnheter(
        virksomheter,
        overordnedeEnheter,
      );

      expect(enriched.map((virksomhet) => virksomhet.overordnetEnhet)).toEqual([
        overordnedeEnheter[1],
        overordnedeEnheter[0],
        overordnedeEnheter[1],
      ]);
      expect(enriched.map((virksomhet) => virksomhet.navn)).toEqual(
        virksomheter.map((virksomhet) => virksomhet.navn),
      );
      expect(
        virksomheter.every((virksomhet) => !("overordnetEnhet" in virksomhet)),
      ).toBe(true);
      expect(
        overordnedeEnheter.map((virksomhet) => virksomhet.organisasjonsnummer),
      ).toEqual(["201", "200"]);
    });

    it("preserves organisations when references or fetched parents are missing or have the wrong type", () => {
      const virksomheter: EregVirksomhetDTO[] = [
        { type: "Virksomhet", navn: { navnelinje1: "Uten referanse" } },
        {
          type: "Virksomhet",
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
        },
      ];

      const enriched = enrichWithOverordnedeEnheter(virksomheter, [
        { type: "Virksomhet", organisasjonsnummer: "200" },
      ]);

      expect(enriched).toHaveLength(2);
      expect(enriched[0]?.navn?.navnelinje1).toBe("Uten referanse");
      expect(
        enriched.every(
          (virksomhet) => virksomhet.overordnetEnhet === undefined,
        ),
      ).toBe(true);
    });

    it("uses a legal entity directly without requesting another reference", () => {
      const juridiskEnhet: EregJuridiskEnhetDTO = {
        type: "JuridiskEnhet",
        organisasjonsnummer: "200",
        juridiskEnhetDetaljer: { sektorkode: "2100" },
      };

      const enriched = enrichWithOverordnedeEnheter([juridiskEnhet], []);

      expect(enriched[0]?.overordnetEnhet).toBe(juridiskEnhet);
      expect(getOverordnetEnhetOrganisasjonsnummer(juridiskEnhet)).toBeNull();
    });

    it("enriches with the nearest section's full data rather than the legal entity", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
        bestaarAvOrganisasjonsledd: [
          {
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "300",
            },
          },
        ],
      };
      const overordnetEnhet: EregOrganisasjonsleddDTO = {
        type: "Organisasjonsledd",
        organisasjonsnummer: "300",
        navn: { navnelinje1: "Testregion" },
        organisasjonsleddDetaljer: { sektorkode: "6100" },
      };
      const juridiskEnhet: EregJuridiskEnhetDTO = {
        type: "JuridiskEnhet",
        organisasjonsnummer: "200",
        juridiskEnhetDetaljer: { sektorkode: "2100" },
      };

      const enriched = enrichWithOverordnedeEnheter(
        [virksomhet],
        [juridiskEnhet, overordnetEnhet],
      );
      const withoutSection = enrichWithOverordnedeEnheter(
        [virksomhet],
        [juridiskEnhet],
      );

      expect(enriched[0]?.overordnetEnhet).toBe(overordnetEnhet);
      expect(withoutSection[0]?.overordnetEnhet).toBeUndefined();
    });
  });
});
