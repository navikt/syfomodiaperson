import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GAMLEOSLO,
  VEILEDER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import {
  DeprecatedSykepengestoppArsakType,
  Status,
  StatusEndring,
  StoppAutomatikk,
  ValidSykepengestoppArsakType,
} from "@/data/pengestopp/types/FlaggPerson";

const defaultStoppAutomatikk: StoppAutomatikk = {
  enhetNr: { value: ENHET_GAMLEOSLO.nummer },
  virksomhetNr: [{ value: VIRKSOMHET_PONTYPANDY.virksomhetsnummer }],
  sykmeldtFnr: { value: ARBEIDSTAKER_DEFAULT.personIdent },
  arsakList: [
    { type: DeprecatedSykepengestoppArsakType.BESTRIDELSE_SYKMELDING },
  ],
};

export const defaultStatusEndring: StatusEndring = {
  veilederIdent: { value: VEILEDER_DEFAULT.ident },
  sykmeldtFnr: { value: ARBEIDSTAKER_DEFAULT.personIdent },
  status: Status.STOPP_AUTOMATIKK,
  virksomhetNr: { value: VIRKSOMHET_PONTYPANDY.virksomhetsnummer },
  opprettet: new Date().toString(),
  enhetNr: { value: ENHET_GAMLEOSLO.nummer },
  arsakList: [],
};

export const createStatusList = (
  created: Date,
  stoppAutomatikk = defaultStoppAutomatikk
) => {
  return stoppAutomatikk.virksomhetNr.map((virksomhet) => {
    return {
      veilederIdent: {
        value: VEILEDER_DEFAULT.ident,
      },
      sykmeldtFnr: {
        value: ARBEIDSTAKER_DEFAULT.personIdent,
      },
      status: Status.STOPP_AUTOMATIKK,
      virksomhetNr: {
        value: virksomhet.value,
      },
      opprettet: created.toISOString(),
      enhetNr: {
        value: "1337",
      },
      arsakList: stoppAutomatikk.arsakList,
    } as StatusEndring;
  });
};

const defaultStatusEndringStoppAutomatikk: StatusEndring = {
  veilederIdent: {
    value: VEILEDER_DEFAULT.ident,
  },
  sykmeldtFnr: {
    value: ARBEIDSTAKER_DEFAULT.personIdent,
  },
  status: Status.STOPP_AUTOMATIKK,
  virksomhetNr: {
    value: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  },
  opprettet: new Date().toISOString(),
  enhetNr: {
    value: "1337",
  },
  arsakList: [{ type: ValidSykepengestoppArsakType.MANGLENDE_MEDVIRKING }],
};

export const statusEndringer = [
  defaultStatusEndringStoppAutomatikk,
  {
    ...defaultStatusEndringStoppAutomatikk,
    arsakList: [
      { type: ValidSykepengestoppArsakType.AKTIVITETSKRAV },
      { type: ValidSykepengestoppArsakType.MEDISINSK_VILKAR },
    ],
  },
  {
    ...defaultStatusEndringStoppAutomatikk,
    arsakList: [
      { type: DeprecatedSykepengestoppArsakType.TILBAKEDATERT_SYKMELDING },
    ],
  },
];
