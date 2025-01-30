import { NarmesteLederRelasjonStatus } from "@/data/leder/ledereTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_ENTERPRISE,
  VIRKSOMHET_KONKURS,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";

const pontypandyLedere = [
  {
    uuid: "1",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001008",
    narmesteLederTelefonnummer: "12345678",
    narmesteLederEpost: "arbeidsgiver@pontypandyfire.gov.uk",
    narmesteLederNavn: "Are Arbeidsgiver",
    aktivFom: "2018-12-02",
    aktivTom: "2019-12-04",
    arbeidsgiverForskutterer: false,
    timestamp: "2018-12-02T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT,
  },
  {
    uuid: "2",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "12345666",
    narmesteLederEpost: "gamlesen@pontypandyfire.gov.uk",
    narmesteLederNavn: "Leder Gamlesen",
    aktivFom: "2019-12-04",
    aktivTom: "2020-02-06",
    arbeidsgiverForskutterer: false,
    timestamp: "2019-12-04T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_NY_LEDER,
  },
  {
    uuid: "3",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001002",
    narmesteLederTelefonnummer: "110",
    narmesteLederEpost: "steele@pontypandyfire.gov.uk",
    narmesteLederNavn: "Station Officer Steele",
    aktivFom: "2020-02-06",
    aktivTom: null,
    arbeidsgiverForskutterer: true,
    timestamp: "2020-02-06T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
];

const brannOgBilLedere = [
  {
    uuid: "4",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654321",
    narmesteLederEpost: "bil@brannogbil.no",
    narmesteLederNavn: "Stig E. Bil",
    aktivFom: "2019-03-10",
    aktivTom: null,
    arbeidsgiverForskutterer: true,
    timestamp: "2019-03-10T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_LEDER,
  },
];

const enterpriseLedere = [
  {
    uuid: "5",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_ENTERPRISE.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_ENTERPRISE.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001966",
    narmesteLederTelefonnummer: "87654329",
    narmesteLederEpost: "kirk@federation.tos",
    narmesteLederNavn: "James Tiberius Kirk",
    aktivFom: "2016-02-04",
    aktivTom: "2019-02-03",
    arbeidsgiverForskutterer: null,
    timestamp: "2016-02-04T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_NY_LEDER,
  },
  {
    uuid: "6",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_ENTERPRISE.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_ENTERPRISE.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001987",
    narmesteLederTelefonnummer: "87654321",
    narmesteLederEpost: "picard@federation.tng",
    narmesteLederNavn: "Jean-Luc Picard",
    aktivFom: "2019-02-04",
    aktivTom: null,
    arbeidsgiverForskutterer: null,
    timestamp: "2019-02-04T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_LEDER,
  },
];

const konkursLedere = [
  {
    uuid: "7",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_KONKURS.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_KONKURS.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "87654321",
    narmesteLederEpost: "test6@test.no",
    narmesteLederNavn: "Lene Leder",
    aktivFom: "2020-02-02",
    aktivTom: "2020-03-03",
    arbeidsgiverForskutterer: null,
    timestamp: "2020-03-03T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSFORHOLD,
  },
];

export const ledereMock = [
  ...pontypandyLedere,
  ...brannOgBilLedere,
  ...enterpriseLedere,
  ...konkursLedere,
];
