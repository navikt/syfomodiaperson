const VIRKSOMHETSNUMMER_WITH_ACTIVE_SYKMELDING = "123456789";
const VIRKSOMHETSNUMMER_WITHOUT_ACTIVE_SYKMELDING = "987654321";

const MILLISECONDS_PER_HOUR = 3600000;
const DAY_IN_MILLISECONDS = MILLISECONDS_PER_HOUR * 24;
const TODAY = new Date();
const TOMORROW = new Date(Date.now() + DAY_IN_MILLISECONDS);
const YESTERDAY = new Date(Date.now() - DAY_IN_MILLISECONDS);
const TWO_DAYS_AGO = new Date(Date.now() - DAY_IN_MILLISECONDS * 2);

export const mockLederWithActiveSykmelding = {
  navn: "Walter Sergei Skinner",
  id: 0,
  aktoerId: "1101101101102",
  tlf: "112",
  epost: "skinner@fbi.no",
  aktiv: null,
  erOppgitt: true,
  fomDato: "1994-22-04T12:00:00+01:00",
  orgnummer: VIRKSOMHETSNUMMER_WITH_ACTIVE_SYKMELDING,
  organisasjonsnavn: "FBI",
  aktivTom: null,
  arbeidsgiverForskuttererLoenn: null,
};

export const mockLederWithoutActiveSykmelding = {
  navn: "Carl Gerhard Busch",
  id: 1,
  aktoerId: "1101101101103",
  tlf: "xxx",
  epost: "spender@syndicate.no",
  aktiv: null,
  erOppgitt: true,
  fomDato: "1993-10-09T12:00:00+01:00",
  orgnummer: VIRKSOMHETSNUMMER_WITHOUT_ACTIVE_SYKMELDING,
  organisasjonsnavn: "The Syndicate",
  aktivTom: null,
  arbeidsgiverForskuttererLoenn: null,
};

export const mockActiveSykmeldingForLeder = {
  status: "SENDT",
  mottakendeArbeidsgiver: {
    virksomhetsnummer: VIRKSOMHETSNUMMER_WITH_ACTIVE_SYKMELDING,
    navn: "FBI",
  },
  mulighetForArbeid: {
    perioder: [
      {
        fom: TODAY,
        tom: TOMORROW,
      },
    ],
  },
};

export const mockInactiveSykmeldingForLeder = {
  status: "SENDT",
  mottakendeArbeidsgiver: {
    virksomhetsnummer: VIRKSOMHETSNUMMER_WITHOUT_ACTIVE_SYKMELDING,
    navn: "The Syndicate",
  },
  mulighetForArbeid: {
    perioder: [
      {
        fom: TWO_DAYS_AGO,
        tom: YESTERDAY,
      },
    ],
  },
};

export const mockSykmeldingWithStatusNyForLeder = {
  status: "NY",
  mottakendeArbeidsgiver: {
    virksomhetsnummer: VIRKSOMHETSNUMMER_WITHOUT_ACTIVE_SYKMELDING,
    navn: "The Syndicate",
  },
  mulighetForArbeid: {
    perioder: [
      {
        fom: TODAY,
        tom: TOMORROW,
      },
    ],
  },
};
