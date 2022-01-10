import { NarmesteLederRelasjonStatus } from "@/data/leder/ledere";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

const VIRKSOMHETSNUMMER_WITH_ACTIVE_SYKMELDING = "123456789";
const VIRKSOMHETSNUMMER_WITHOUT_ACTIVE_SYKMELDING = "987654321";

const MILLISECONDS_PER_HOUR = 3600000;
const DAY_IN_MILLISECONDS = MILLISECONDS_PER_HOUR * 24;
const TODAY = new Date();
const TOMORROW = new Date(Date.now() + DAY_IN_MILLISECONDS);
const YESTERDAY = new Date(Date.now() - DAY_IN_MILLISECONDS);
const TWO_DAYS_AGO = new Date(Date.now() - DAY_IN_MILLISECONDS * 2);

export const mockLederWithActiveSykmelding = {
  uuid: "0",
  arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: VIRKSOMHETSNUMMER_WITH_ACTIVE_SYKMELDING,
  virksomhetsnavn: "FBI",
  narmesteLederPersonIdentNumber: "02690001002",
  narmesteLederEpost: "skinner@fbi.no",
  narmesteLederTelefonnummer: "112",
  narmesteLederNavn: "Walter Sergei Skinner",
  aktivFom: "1994-22-04",
  aktivTom: "1995-22-04",
  timestamp: "1995-22-04T12:00:00+01:00",
  status: NarmesteLederRelasjonStatus.DEAKTIVERT,
  arbeidsgiverForskutterer: null,
};

export const mockLederWithoutActiveSykmelding = {
  uuid: "1",
  arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: VIRKSOMHETSNUMMER_WITHOUT_ACTIVE_SYKMELDING,
  virksomhetsnavn: "The Syndicate",
  narmesteLederPersonIdentNumber: "02690001003",
  narmesteLederEpost: "spender@syndicate.no",
  narmesteLederTelefonnummer: "xxx",
  narmesteLederNavn: "Carl Gerhard Busch",
  aktivFom: "1993-10-09",
  aktivTom: "1994-10-09",
  timestamp: "1994-10-09T12:00:00+01:00",
  status: NarmesteLederRelasjonStatus.DEAKTIVERT,
  arbeidsgiverForskutterer: null,
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
