import { NarmesteLederRelasjonStatus } from "../../src/data/leder/ledereTypes";
import { RSContext } from "../../src/data/modiacontext/modiacontextTypes";

export const TODAY = new Date().setHours(0, 0, 0, 0);

export const ARBEIDSTAKER_DEFAULT = {
  epost: "samuel@pontypandyfire.gov.uk",
  personIdent: "19026900010",
  navn: {
    fornavn: "Samuel",
    mellomnavn: "Sam",
    etternavn: "Jones",
  },
};

export const AKTIV_BRUKER_DEFAULT: Partial<RSContext> = {
  aktivBruker: ARBEIDSTAKER_DEFAULT.personIdent,
};

export const ARBEIDSTAKER_DEFAULT_FULL_NAME = `${ARBEIDSTAKER_DEFAULT.navn.fornavn} ${ARBEIDSTAKER_DEFAULT.navn.mellomnavn} ${ARBEIDSTAKER_DEFAULT.navn.etternavn}`;

export const ENHET_GRUNERLOKKA = {
  nummer: "0315",
  navn: "NAV Grünerløkka",
};

export const ENHET_GAMLEOSLO = {
  nummer: "0316",
  navn: "NAV Gamle Oslo",
};

export const BEHANDLENDE_ENHET_DEFAULT = {
  enhetId: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};

export const VEILEDER_IDENT_DEFAULT = "Z990000";

export const VEILEDER_DEFAULT = {
  ident: VEILEDER_IDENT_DEFAULT,
  navn: "Vetle Veileder",
  epost: "vetle.veileder@nav.no",
  telefonnummer: "12345678",
};

export const VIRKSOMHET_PONTYPANDY = {
  virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
  virksomhetsnummer: "110110110",
};

export const NARMESTE_LEDER_DEFAULT = {
  navn: "Tatten Tattover",
};

export const LEDERE_DEFAULT = [
  {
    uuid: "3",
    arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    narmesteLederPersonIdentNumber: "02690001009",
    narmesteLederTelefonnummer: "12345666",
    narmesteLederEpost: "test3@test.no",
    narmesteLederNavn: NARMESTE_LEDER_DEFAULT.navn,
    aktivFom: "2020-10-03",
    aktivTom: null,
    arbeidsgiverForskutterer: false,
    timestamp: "2020-02-06T12:00:00+01:00",
    status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
  },
];
