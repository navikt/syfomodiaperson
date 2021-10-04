import {
  NarmesteLederRelasjonDTO,
  NarmesteLederRelasjonStatus,
} from "@/data/leder/ledere";
import { senesteTom, tidligsteFom } from "./periodeUtils";
import {
  erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker,
  erOppfolgingstilfelleSluttDatoPassert,
  harArbeidstakerSvartPaaMotebehov,
} from "./motebehovUtils";
import { activeSykmeldingerSentToArbeidsgiver } from "./sykmeldinger/sykmeldingUtils";
import { OppfolgingstilfelleperioderMapState } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

export const ledereIVirksomheterMedMotebehovsvarFraArbeidstaker = (
  ledereData: NarmesteLederRelasjonDTO[],
  motebehovData: MotebehovVeilederDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledereData.filter((leder: NarmesteLederRelasjonDTO) =>
    motebehovData.some(
      (motebehov) =>
        motebehov.opprettetAv === motebehov.aktorId &&
        leder.virksomhetsnummer === motebehov.virksomhetsnummer
    )
  );
};

export const ledereIVirksomheterDerIngenLederHarSvartPaMotebehov = (
  ledereListe: NarmesteLederRelasjonDTO[],
  motebehovData: MotebehovVeilederDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledereListe.filter(
    (leder) =>
      !motebehovData.some(
        (motebehov) =>
          motebehov.opprettetAv !== motebehov.aktorId &&
          motebehov.virksomhetsnummer === leder.virksomhetsnummer
      )
  );
};

export const ledereMedOppfolgingstilfelleInnenforMotebehovperioden = (
  ledereData: NarmesteLederRelasjonDTO[],
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState
): NarmesteLederRelasjonDTO[] => {
  return ledereData.filter((leder) => {
    const startOppfolgingsdato =
      oppfolgingstilfelleperioder[leder.virksomhetsnummer] &&
      oppfolgingstilfelleperioder[leder.virksomhetsnummer].data
        ? tidligsteFom(
            oppfolgingstilfelleperioder[leder.virksomhetsnummer].data
          )
        : new Date();
    const sluttOppfolgingsdato =
      oppfolgingstilfelleperioder[leder.virksomhetsnummer] &&
      oppfolgingstilfelleperioder[leder.virksomhetsnummer].data
        ? senesteTom(oppfolgingstilfelleperioder[leder.virksomhetsnummer].data)
        : new Date();

    return (
      startOppfolgingsdato &&
      sluttOppfolgingsdato &&
      !erOppfolgingstilfelleSluttDatoPassert(sluttOppfolgingsdato) &&
      erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker(startOppfolgingsdato)
    );
  });
};

export const ledereUtenMotebehovsvar = (
  ledereData: NarmesteLederRelasjonDTO[],
  motebehovData: MotebehovVeilederDTO[],
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState
): NarmesteLederRelasjonDTO[] => {
  const arbeidstakerHarSvartPaaMotebehov =
    motebehovData && harArbeidstakerSvartPaaMotebehov(motebehovData);

  const filtrertLederListe = arbeidstakerHarSvartPaaMotebehov
    ? ledereIVirksomheterMedMotebehovsvarFraArbeidstaker(
        ledereData,
        motebehovData
      )
    : ledereMedOppfolgingstilfelleInnenforMotebehovperioden(
        ledereData,
        oppfolgingstilfelleperioder
      );

  const ledereIVirksomhetUtenMotebehovSvarFraLeder = ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
    filtrertLederListe,
    motebehovData
  );

  return ledereIVirksomhetUtenMotebehovSvarFraLeder.filter((leder) => {
    return leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV;
  });
};

export const lederHasActiveSykmelding = (
  leder: NarmesteLederRelasjonDTO,
  sykmeldinger: SykmeldingOldFormat[]
): boolean => {
  const activeSykmeldingerWithArbeidsgiver = activeSykmeldingerSentToArbeidsgiver(
    sykmeldinger
  );

  return activeSykmeldingerWithArbeidsgiver.some(
    (sykmelding) =>
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer ===
      leder.virksomhetsnummer
  );
};

export const ledereWithActiveLedereFirst = (
  ledereData: NarmesteLederRelasjonDTO[],
  sykmeldinger: SykmeldingOldFormat[]
): NarmesteLederRelasjonDTO[] => {
  return ledereData.sort((leder1, leder2) => {
    const leder1Active = lederHasActiveSykmelding(leder1, sykmeldinger);
    const leder2Active = lederHasActiveSykmelding(leder2, sykmeldinger);

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

interface SykmeldingLeder {
  erOppgitt: boolean;
  orgnummer?: string;
  organisasjonsnavn?: string;
}

const sykmelding2Leder = (sykmelding: SykmeldingOldFormat): SykmeldingLeder => {
  return {
    erOppgitt: false,
    orgnummer: sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer,
    organisasjonsnavn: sykmelding.mottakendeArbeidsgiver?.navn,
  };
};

const removeDuplicatesFromLederList = (
  ledere: SykmeldingLeder[]
): SykmeldingLeder[] => {
  return ledere.filter((leder, index) => {
    return (
      ledere.findIndex((leder2) => {
        return leder2.orgnummer === leder.orgnummer;
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

export const currentLedere = (
  ledere: NarmesteLederRelasjonDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledere.filter(
    (leder) => leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV
  );
};

export const formerLedere = (
  ledere: NarmesteLederRelasjonDTO[]
): NarmesteLederRelasjonDTO[] => {
  return ledere.filter(
    (leder) => leder.status !== NarmesteLederRelasjonStatus.INNMELDT_AKTIV
  );
};

export const ledereSortertPaaNavnOgOrganisasjonsnavn = (
  ledere: NarmesteLederRelasjonDTO[]
): NarmesteLederRelasjonDTO[] =>
  ledere
    .sort((a, b) => {
      if (a.narmesteLederNavn > b.narmesteLederNavn) {
        return 1;
      } else if (b.narmesteLederNavn > a.narmesteLederNavn) {
        return -1;
      }
      return 0;
    })
    .sort((a, b) => {
      if (a.virksomhetsnavn > b.virksomhetsnavn) {
        return 1;
      } else if (b.virksomhetsnavn > a.virksomhetsnavn) {
        return -1;
      }
      return 0;
    });
