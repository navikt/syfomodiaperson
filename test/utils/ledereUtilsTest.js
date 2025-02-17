import { describe, expect, it } from "vitest";
import {
  ledereWithActiveLedereFirst,
  lederHasActiveSykmelding,
  virksomheterWithoutLeder,
} from "@/utils/ledereUtils";
import {
  mockActiveSykmeldingForLeder,
  mockInactiveSykmeldingForLeder,
  mockLederWithActiveSykmelding,
  mockLederWithoutActiveSykmelding,
  mockSykmeldingWithStatusNyForLeder,
} from "../mockdata/mockLedere";

describe("ledereUtils", () => {
  describe("lederHasActiveSykmelding", () => {
    it("Returns true if there is an active sykmelding for leders virksomhet", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(true);
    });

    it("Returns false if sykmelding for leders virksomhet is not active", () => {
      const leder = mockLederWithoutActiveSykmelding;
      const sykmeldinger = [mockInactiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(false);
    });

    it("Returns false if there are no sykmeldinger for leders virksomhet", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockInactiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(false);
    });

    it("Returns false if sykmelding for leders virksomhet does not have status SENDT, regardless of acive dates", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockSykmeldingWithStatusNyForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(false);
    });
  });

  describe("ledereWithActiveLedereFirst", () => {
    it("Returns a list where leder for virksomhet that has active sykmelding comes first", () => {
      const lederList = [
        mockLederWithoutActiveSykmelding,
        mockLederWithActiveSykmelding,
      ];
      const sykmeldinger = [
        mockActiveSykmeldingForLeder,
        mockInactiveSykmeldingForLeder,
      ];

      const sortedList = ledereWithActiveLedereFirst(lederList, sykmeldinger);

      expect(sortedList[0]).to.deep.equal(mockLederWithActiveSykmelding);
      expect(sortedList[1]).to.deep.equal(mockLederWithoutActiveSykmelding);
    });
  });

  describe("virksomheterWithoutLeder", () => {
    it("Returns a list with one leder if virksomhet in sykmelding does not have leder ", () => {
      const lederList = [mockLederWithoutActiveSykmelding];
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      const expectedLeder = {
        arbeidsgiverForskutterer: undefined,
        virksomhetsnummer:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.virksomhetsnummer,
        virksomhetsnavn:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.navn,
      };

      expect(ledereFromSykmeldinger.length).to.equal(1);
      expect(ledereFromSykmeldinger[0]).to.deep.equal(expectedLeder);
    });

    it("Returns empty list if there are no sykmeldinger", () => {
      const lederList = [];
      const sykmeldinger = [];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      expect(ledereFromSykmeldinger.length).to.be.equal(0);
    });

    it("Returns empty list if virksomhet in sykmeldinger has leder", () => {
      const lederList = [mockLederWithActiveSykmelding];
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      expect(ledereFromSykmeldinger.length).to.be.equal(0);
    });

    it("Returns only one leder even if there are more than one active sykmelding for virksomhet without leder", () => {
      const lederList = [mockLederWithoutActiveSykmelding];
      const sykmeldinger = [
        mockActiveSykmeldingForLeder,
        mockActiveSykmeldingForLeder,
      ];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      const expectedLeder = {
        arbeidsgiverForskutterer: undefined,
        virksomhetsnummer:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.virksomhetsnummer,
        virksomhetsnavn:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.navn,
      };

      expect(ledereFromSykmeldinger.length).to.equal(1);
      expect(ledereFromSykmeldinger[0]).to.deep.equal(expectedLeder);
    });
  });
});
