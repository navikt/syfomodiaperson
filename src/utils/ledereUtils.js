import { senesteTom, tidligsteFom } from "./periodeUtils";
import {
  erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker,
  erOppfolgingstilfelleSluttDatoPassert,
  harArbeidstakerSvartPaaMotebehov,
} from "./motebehovUtils";
import { activeSykmeldingerSentToArbeidsgiver } from "./sykmeldinger/sykmeldingUtils";

export const ledereIVirksomheterMedMotebehovsvarFraArbeidstaker = (
  ledereData,
  motebehovData
) => {
  return ledereData.filter((leder) => {
    return (
      motebehovData.findIndex((motebehov) => {
        return (
          motebehov.opprettetAv === motebehov.aktorId &&
          leder.orgnummer === motebehov.virksomhetsnummer
        );
      }) >= 0
    );
  });
};

export const ledereIVirksomheterDerIngenLederHarSvartPaMotebehov = (
  ledereListe,
  motebehovData
) => {
  return ledereListe.filter((leder) => {
    return (
      motebehovData.findIndex((motebehov) => {
        return (
          motebehov.opprettetAv !== motebehov.aktorId &&
          motebehov.virksomhetsnummer === leder.orgnummer
        );
      }) < 0
    );
  });
};

export const ledereMedOppfolgingstilfelleInnenforMotebehovperioden = (
  ledereData,
  oppfolgingstilfelleperioder
) => {
  return ledereData.filter((leder) => {
    const startOppfolgingsdato =
      oppfolgingstilfelleperioder[leder.orgnummer] &&
      oppfolgingstilfelleperioder[leder.orgnummer].data
        ? tidligsteFom(oppfolgingstilfelleperioder[leder.orgnummer].data)
        : new Date();
    const sluttOppfolgingsdato =
      oppfolgingstilfelleperioder[leder.orgnummer] &&
      oppfolgingstilfelleperioder[leder.orgnummer].data
        ? senesteTom(oppfolgingstilfelleperioder[leder.orgnummer].data)
        : new Date();

    return (
      startOppfolgingsdato &&
      sluttOppfolgingsdato &&
      !erOppfolgingstilfelleSluttDatoPassert(sluttOppfolgingsdato) &&
      erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker(startOppfolgingsdato)
    );
  });
};

const isNewerLeader = (ledere, givenLeder) => {
  return (
    ledere.findIndex((lederCandidate) => {
      return (
        givenLeder.aktoerId !== lederCandidate.aktoerId &&
        givenLeder.orgnummer === lederCandidate.orgnummer &&
        givenLeder.fomDato < lederCandidate.fomDato
      );
    }) > -1
  );
};

const newestLederForEachVirksomhet = (ledere) => {
  return ledere.filter((leder) => {
    return !isNewerLeader(ledere, leder);
  });
};

export const ledereUtenMotebehovsvar = (
  ledereData,
  motebehovData,
  oppfolgingstilfelleperioder
) => {
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

  return newestLederForEachVirksomhet(
    ledereIVirksomhetUtenMotebehovSvarFraLeder
  );
};

export const lederHasActiveSykmelding = (leder, sykmeldinger) => {
  const activeSykmeldingerWithArbeidsgiver = activeSykmeldingerSentToArbeidsgiver(
    sykmeldinger
  );

  return (
    activeSykmeldingerWithArbeidsgiver.findIndex((sykmelding) => {
      return (
        sykmelding.mottakendeArbeidsgiver.virksomhetsnummer === leder.orgnummer
      );
    }) > -1
  );
};

export const ledereWithActiveLedereFirst = (ledereData, sykmeldinger) => {
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

const sykmeldingerWithoutMatchingLeder = (ledere, sykmeldinger) => {
  return sykmeldinger.filter((sykmelding) => {
    return (
      ledere.findIndex((leder) => {
        return (
          leder.orgnummer ===
          sykmelding.mottakendeArbeidsgiver.virksomhetsnummer
        );
      }) === -1
    );
  });
};

const sykmelding2Leder = (sykmelding) => {
  return {
    erOppgitt: false,
    orgnummer: sykmelding.mottakendeArbeidsgiver.virksomhetsnummer,
    organisasjonsnavn: sykmelding.mottakendeArbeidsgiver.navn,
  };
};

const removeDuplicatesFromLederList = (ledere) => {
  return ledere.filter((leder, index) => {
    return (
      ledere.findIndex((leder2) => {
        return leder2.orgnummer === leder.orgnummer;
      }) === index
    );
  });
};

export const virksomheterWithoutLeder = (ledere, sykmeldinger) => {
  const activeSykmeldinger = activeSykmeldingerSentToArbeidsgiver(sykmeldinger);

  const sykmeldingerWithoutLeder = sykmeldingerWithoutMatchingLeder(
    ledere,
    activeSykmeldinger
  );

  const virksomheterAsLedere = sykmeldingerWithoutLeder.map(sykmelding2Leder);

  return removeDuplicatesFromLederList(virksomheterAsLedere);
};

export const currentLedere = (ledere) => {
  return ledere.filter((leder) => {
    return leder.aktivTom === null;
  });
};

export const formerLedere = (ledere) => {
  return ledere.filter((leder) => {
    return leder.aktivTom !== null;
  });
};

const isLederEarlierThanGivenLeder = (givenLeder, leder) => {
  return new Date(leder.fomDato) < new Date(givenLeder.fomDato);
};

const ledereFromGivenLedersVirksomhet = (givenLeder, ledere) => {
  return ledere.filter((leder) => {
    return leder.orgnummer === givenLeder.orgnummer;
  });
};

const laterLedereThanGivenLeder = (givenLeder, ledere) => {
  return ledere.filter((leder) => {
    return isLederEarlierThanGivenLeder(leder, givenLeder);
  });
};

const earliestLeder = (ledere) => {
  let currentEarliestLeder = null;
  ledere.forEach((possibleEarliestLeder) => {
    if (
      currentEarliestLeder === null ||
      isLederEarlierThanGivenLeder(currentEarliestLeder, possibleEarliestLeder)
    ) {
      currentEarliestLeder = possibleEarliestLeder;
    }
  });

  return currentEarliestLeder;
};

const findNextLeder = (currentLeder, ledere) => {
  const ledereFromCorrectVirksomhet = ledereFromGivenLedersVirksomhet(
    currentLeder,
    ledere
  );
  const laterLedere = laterLedereThanGivenLeder(
    currentLeder,
    ledereFromCorrectVirksomhet
  );

  return earliestLeder(laterLedere);
};

export const mapTomDateToEarlierLedere = (ledere) => {
  return ledere.map((leder) => {
    const nextLeder = findNextLeder(leder, ledere);

    if (nextLeder !== null) {
      return {
        ...leder,
        aktivTom: nextLeder.fomDato,
      };
    }
    return leder;
  });
};
