import { describe, expect, it } from "vitest";
import {
  fjerneDuplikatInnsendereMotebehov,
  hentSistBehandletMotebehov,
} from "@/utils/motebehovUtils";
import {
  meldtMotebehovArbeidstakerBehandletMock,
  svartJaMotebehovArbeidstakerUbehandletMock,
} from "@/mocks/syfomotebehov/motebehovMock";
import {
  MotebehovInnmelder,
  MotebehovVeilederDTO,
  Virksomhetsnummer,
} from "@/data/motebehov/types/motebehovTypes";
import {
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";

describe("motebehovUtils", () => {
  describe("hentSistBehandletMotebehov", () => {
    it("Returnerer ingenting om det er ingen motebehov", () => {
      expect(hentSistBehandletMotebehov([])).to.be.undefined;
    });
    it("Returnerer ingen motebehov i lista når ingen er behandlet", () => {
      const motebehovUbehandlet1 = {
        ...svartJaMotebehovArbeidstakerUbehandletMock,
        behandletTidspunkt: null,
      };
      const motebehovUbehandlet2 = {
        ...svartJaMotebehovArbeidstakerUbehandletMock,
        behandletTidspunkt: null,
      };
      expect(
        hentSistBehandletMotebehov([motebehovUbehandlet1, motebehovUbehandlet2])
      ).to.be.undefined;
    });
    it("Returnerer motebehov med siste behandlet tidspunkt", () => {
      const motebehovBehandlet1 = {
        ...meldtMotebehovArbeidstakerBehandletMock(),
        behandletTidspunkt: new Date("2021-04-03T15:18:24.000Z"),
      };
      const motebehovBehandlet2 = {
        ...meldtMotebehovArbeidstakerBehandletMock(),
        behandletTidspunkt: new Date("2021-04-08T15:18:24.000Z"),
      };
      expect(
        hentSistBehandletMotebehov([motebehovBehandlet1, motebehovBehandlet2])
      ).to.be.deep.equal(motebehovBehandlet2);
    });
  });
  describe("fjerneDuplikatInnsendereMotebehov", () => {
    const ARBEIDSTAKER = MotebehovInnmelder.ARBEIDSTAKER;
    const ARBEIDSGIVER = MotebehovInnmelder.ARBEIDSGIVER;

    const PONTYPANDY_VIRKSOMHETSNR = VIRKSOMHET_PONTYPANDY.virksomhetsnummer;
    const BRANNOGBIL_VIRKSOMHETSNR = VIRKSOMHET_BRANNOGBIL.virksomhetsnummer;

    const motebehov = (
      virksomhetsnummer: Virksomhetsnummer,
      innmelderType: MotebehovInnmelder,
      opprettetDato: string
    ): MotebehovVeilederDTO => {
      return {
        ...svartJaMotebehovArbeidstakerUbehandletMock,
        virksomhetsnummer: virksomhetsnummer,
        innmelderType: innmelderType,
        opprettetDato: new Date(opprettetDato),
      };
    };

    it("Arbeidsgiver og arbeidstaker ved samme virksomhet", () => {
      const motebehovListe: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
      ];

      const expected: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
      ];

      const actual = fjerneDuplikatInnsendereMotebehov(motebehovListe);

      expect(actual).to.be.deep.equal(expected);
    });

    it("Flere forekomster av arbeidsgiver og arbeidstaker ved samme virksomhet - Velger første unike forekomst", () => {
      const motebehovListe: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-18"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-10"),
      ];

      const expected: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-18"),
      ];

      const actual = fjerneDuplikatInnsendereMotebehov(motebehovListe);

      expect(actual).to.be.deep.equal(expected);
    });

    it("Flere forekomster (inkl. tid) av arbeidsgiver og arbeidstaker ved samme virksomhet - Velger første unike forekomst", () => {
      const motebehovListe: MotebehovVeilederDTO[] = [
        motebehov(
          PONTYPANDY_VIRKSOMHETSNR,
          ARBEIDSGIVER,
          "2025-04-20T15:05:00.000Z"
        ),
        motebehov(
          PONTYPANDY_VIRKSOMHETSNR,
          ARBEIDSGIVER,
          "2025-04-20T15:00:00.000Z"
        ),
        motebehov(
          PONTYPANDY_VIRKSOMHETSNR,
          ARBEIDSTAKER,
          "2025-04-19T14:15:00.000Z"
        ),
        motebehov(
          PONTYPANDY_VIRKSOMHETSNR,
          ARBEIDSTAKER,
          "2025-04-19T14:10:00.000Z"
        ),
      ];

      const expected: MotebehovVeilederDTO[] = [
        motebehov(
          PONTYPANDY_VIRKSOMHETSNR,
          ARBEIDSGIVER,
          "2025-04-20T15:05:00.000Z"
        ),
        motebehov(
          PONTYPANDY_VIRKSOMHETSNR,
          ARBEIDSTAKER,
          "2025-04-19T14:15:00.000Z"
        ),
      ];

      const actual = fjerneDuplikatInnsendereMotebehov(motebehovListe);

      expect(actual).to.be.deep.equal(expected);
    });

    it("Miks av arbeidsgiver og arbeidstaker ved forskjellige virksomheter", () => {
      const motebehovListe: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-18"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-10"),
      ];

      const expected: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-18"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-10"),
      ];

      const actual = fjerneDuplikatInnsendereMotebehov(motebehovListe);

      expect(actual).to.be.deep.equal(expected);
    });

    it("Miks av arbeidsgiver og arbeidstaker ved forskjellige virksomheter med flere forekomster fra hver - Velger første unike forekomst", () => {
      const motebehovListe: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-19"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-18"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-17"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-14"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-10"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-09"),
      ];

      const expected: MotebehovVeilederDTO[] = [
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-20"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-18"),
        motebehov(PONTYPANDY_VIRKSOMHETSNR, ARBEIDSTAKER, "2025-04-15"),
        motebehov(BRANNOGBIL_VIRKSOMHETSNR, ARBEIDSGIVER, "2025-04-10"),
      ];

      const actual = fjerneDuplikatInnsendereMotebehov(motebehovListe);

      expect(actual).to.be.deep.equal(expected);
    });
  });
});
