export enum NarmesteLederRelasjonStatus {
  INNMELDT_AKTIV = "INNMELDT_AKTIV",
  DEAKTIVERT = "DEAKTIVERT",
  DEAKTIVERT_ARBEIDSTAKER = "DEAKTIVERT_ARBEIDSTAKER",
  DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING = "DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING",
  DEAKTIVERT_LEDER = "DEAKTIVERT_LEDER",
  DEAKTIVERT_ARBEIDSFORHOLD = "DEAKTIVERT_ARBEIDSFORHOLD",
  DEAKTIVERT_NY_LEDER = "DEAKTIVERT_NY_LEDER",
}

export const ledereMock = [
  {
    uuid: "1",
    arbeidstakerPersonIdentNumber: "19026900010",
    virksomhetsnummer: "110110110",
    virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
    narmesteLederPersonIdentNumber: "02690001002",
    narmesteLederTelefonnummer: "110",
    narmesteLederEpost: "steele@pontypandyfire.gov.uk",
    narmesteLederNavn: "Station Officer Steele",
    aktivFom: "2018-12-02",
    aktivTom: "2019-12-04",
    arbeidsgiverForskutterer: true,
    timestamp: "2019-12-02T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT,
  },
  {
    uuid: "2",
    arbeidstakerPersonIdentNumber: "19026900010",
    virksomhetsnummer: "110110110",
    virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
    narmesteLederPersonIdentNumber: "02690001008",
    narmesteLederTelefonnummer: "12345678",
    narmesteLederEpost: "test2@test.no",
    narmesteLederNavn: "Are Arbeidsgiver",
    aktivFom: "2019-12-04",
    aktivTom: "2020-02-06",
    arbeidsgiverForskutterer: false,
    timestamp: "2020-02-03T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_NY_LEDER,
  },
  {
    uuid: "3",
    arbeidstakerPersonIdentNumber: "19026900010",
    virksomhetsnummer: "110110110",
    virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "12345666",
    narmesteLederEpost: "test3@test.no",
    narmesteLederNavn: "Tatten Tattover",
    aktivFom: "2020-02-06",
    aktivTom: null,
    arbeidsgiverForskutterer: false,
    timestamp: "2020-02-06T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
  {
    uuid: "4",
    arbeidstakerPersonIdentNumber: "19026900001",
    virksomhetsnummer: "555666444",
    virksomhetsnavn: "BRANN OG BIL AS",
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654321",
    narmesteLederEpost: "test3@test.no",
    narmesteLederNavn: "Lene Leder",
    aktivFom: "2019-03-10",
    aktivTom: null,
    arbeidsgiverForskutterer: true,
    timestamp: "2019-03-10T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
  {
    uuid: "5",
    arbeidstakerPersonIdentNumber: "19026900002",
    virksomhetsnummer: "000999000",
    virksomhetsnavn: "KONKURS BEDRIFT OG VENNER AS",
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654329",
    narmesteLederEpost: "test4@test.no",
    narmesteLederNavn: "F. Orrige Leder",
    aktivFom: "2020-01-01",
    aktivTom: "2020-02-02",
    arbeidsgiverForskutterer: null,
    timestamp: "2020-02-02T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_LEDER,
  },
  {
    uuid: "6",
    arbeidstakerPersonIdentNumber: "19026900002",
    virksomhetsnummer: "000999000",
    virksomhetsnavn: "KONKURS BEDRIFT OG VENNER AS",
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654321",
    narmesteLederEpost: "test6@test.no",
    narmesteLederNavn: "He-man",
    aktivFom: "2020-02-02",
    aktivTom: "2020-03-03",
    arbeidsgiverForskutterer: null,
    timestamp: "2020-03-03T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSTAKER,
  },
  {
    uuid: "7",
    arbeidstakerPersonIdentNumber: "19026900002",
    virksomhetsnummer: "000999000",
    virksomhetsnavn: "KONKURS BEDRIFT OG VENNER AS",
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654329",
    narmesteLederEpost: "test4@test.no",
    narmesteLederNavn: "F. Orrige Leder",
    aktivFom: "2020-03-03",
    aktivTom: "2020-04-04",
    arbeidsgiverForskutterer: null,
    timestamp: "2020-04-04T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSFORHOLD,
  },
  {
    uuid: "8",
    arbeidstakerPersonIdentNumber: "19026900003",
    virksomhetsnummer: "170100000",
    virksomhetsnavn: "USS Enterprise",
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654321",
    narmesteLederEpost: "test5@test.no",
    narmesteLederNavn: "Jean-Luc Picard",
    aktivFom: "2019-02-04",
    aktivTom: null,
    arbeidsgiverForskutterer: null,
    timestamp: "2019-02-04T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
];
