import { NarmesteLederRelasjonStatus } from "@/data/leder/ledereTypes";
import { RSContext } from "@/data/modiacontext/modiacontextTypes";
import { Veileder } from "@/data/veilederinfo/types/Veileder";
import {
  VeilederBrukerKnytningDTO,
  VeilederTildelingHistorikkDTO,
} from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";

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

export const ENHET_NAV_UTLAND = {
  nummer: "0393",
  navn: "NAV Oppfølging utland",
};

export const BEHANDLENDE_ENHET_DEFAULT = {
  enhetId: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};

export const VEILEDER_IDENT_DEFAULT = "Z990000";

export const VEILEDER_DEFAULT = new Veileder(
  VEILEDER_IDENT_DEFAULT,
  "Vetle",
  "Veileder",
  "vetle.veileder@nav.no",
  "12345678"
);

export const ANNEN_VEILEDER_IDENT = "Z970000";

export const ANNEN_VEILEDER = new Veileder(
  ANNEN_VEILEDER_IDENT,
  "Valdemar",
  "Vaileder",
  "valdemar.veileder@nav.no",
  "12345678"
);

export const VIRKSOMHET_PONTYPANDY = {
  virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
  virksomhetsnummer: "110110110",
};

export const VIRKSOMHET_UTEN_NARMESTE_LEDER = {
  virksomhetsnavn: "Virksomhet uten leder AS",
  virksomhetsnummer: "000999000",
};

export const VIRKSOMHET_BRANNOGBIL = {
  virksomhetsnavn: "BRANN OG BIL AS",
  virksomhetsnummer: "555666444",
};

export const VIRKSOMHET_ENTERPRISE = {
  virksomhetsnavn: "USS Enterprise",
  virksomhetsnummer: "333666999",
};

export const VIRKSOMHET_KONKURS = {
  virksomhetsnavn: "KONKURS BEDRIFT OG VENNER AS",
  virksomhetsnummer: "000000001",
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

export const VEILEDER_BRUKER_KNYTNING_DEFAULT: VeilederBrukerKnytningDTO = {
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  tildeltVeilederident: VEILEDER_IDENT_DEFAULT,
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
};

export const VEILEDER_TILDELING_HISTORIKK_DEFAULT: VeilederTildelingHistorikkDTO[] =
  [
    {
      tildeltDato: new Date("2024-10-15"),
      tildeltVeileder: VEILEDER_IDENT_DEFAULT,
      tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
      tildeltAv: VEILEDER_IDENT_DEFAULT,
    },
  ];

export const VEILEDER_TILDELING_HISTORIKK_ANNEN: VeilederTildelingHistorikkDTO[] =
  [
    {
      tildeltDato: new Date("2024-10-15"),
      tildeltVeileder: VEILEDER_IDENT_DEFAULT,
      tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
      tildeltAv: ANNEN_VEILEDER_IDENT,
    },
  ];

export const VEILEDER_TILDELING_HISTORIKK_SYSTEM: VeilederTildelingHistorikkDTO[] =
  [
    {
      tildeltDato: new Date("2024-10-15"),
      tildeltVeileder: VEILEDER_IDENT_DEFAULT,
      tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
      tildeltAv: "X000000",
    },
  ];
