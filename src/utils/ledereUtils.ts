import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { activeSykmeldingerSentToArbeidsgiver } from "./sykmeldinger/sykmeldingUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

export const lederHasActiveSykmelding = (
  lederVirksomhetsnummer: string,
  sykmeldinger: SykmeldingOldFormat[]
): boolean => {
  const activeSykmeldingerWithArbeidsgiver =
    activeSykmeldingerSentToArbeidsgiver(sykmeldinger);

  return activeSykmeldingerWithArbeidsgiver.some(
    (sykmelding) =>
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer ===
      lederVirksomhetsnummer
  );
};

export const ledereWithActiveLedereFirst = (
  ledereData: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): NarmesteLederRelasjonDTO[] => {
  return ledereData.sort((leder1, leder2) => {
    const leder1Active = lederHasActiveSykmelding(
      leder1.virksomhetsnummer,
      sykmeldinger
    );
    const leder2Active = lederHasActiveSykmelding(
      leder2.virksomhetsnummer,
      sykmeldinger
    );

    if (leder1Active && !leder2Active) {
      return -1;
    }
    if (leder2Active && !leder1Active) {
      return 1;
    }
    return 0;
  });
};

const sykmeldingerWithoutMatchingLeder = (
  ledere: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] => {
  return sykmeldinger.filter(
    (sykmelding) =>
      !ledere.some(
        (leder) =>
          leder.virksomhetsnummer ===
          sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer
      )
  );
};

export interface SykmeldingLeder {
  arbeidsgiverForskutterer?: boolean;
  virksomhetsnummer: string;
  virksomhetsnavn: string;
}

const sykmelding2Leder = (sykmelding: SykmeldingOldFormat): SykmeldingLeder => {
  return {
    arbeidsgiverForskutterer: undefined,
    virksomhetsnummer:
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer || "",
    virksomhetsnavn: sykmelding.mottakendeArbeidsgiver?.navn || "",
  };
};

const removeDuplicatesFromLederList = (
  ledere: SykmeldingLeder[]
): SykmeldingLeder[] => {
  return ledere.filter((leder, index) => {
    return (
      ledere.findIndex((leder2) => {
        return leder2.virksomhetsnummer === leder.virksomhetsnummer;
      }) === index
    );
  });
};

export const virksomheterWithoutLeder = (
  ledere: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingLeder[] => {
  const activeSykmeldinger = activeSykmeldingerSentToArbeidsgiver(sykmeldinger);

  const sykmeldingerWithoutLeder = sykmeldingerWithoutMatchingLeder(
    ledere,
    activeSykmeldinger
  );

  const virksomheterAsLedere = sykmeldingerWithoutLeder.map(sykmelding2Leder);

  return removeDuplicatesFromLederList(virksomheterAsLedere);
};

export const narmesteLederForVirksomhet = (
  ledere: NarmesteLederRelasjonDTO[],
  virksomhetsnummer: string
): NarmesteLederRelasjonDTO | undefined => {
  return ledere.find((leder) => leder.virksomhetsnummer === virksomhetsnummer);
};
