import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GAMLEOSLO,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import {
  Status,
  StoppAutomatikk,
  SykepengestoppArsakType,
} from "../../src/data/pengestopp/types/FlaggPerson";

const defaultStoppAutomatikk: StoppAutomatikk = {
  enhetNr: { value: ENHET_GAMLEOSLO.nummer },
  virksomhetNr: [{ value: VIRKSOMHET_PONTYPANDY.virksomhetsnummer }],
  sykmeldtFnr: { value: ARBEIDSTAKER_DEFAULT.personIdent },
  arsakList: [{ type: SykepengestoppArsakType.BESTRIDELSE_SYKMELDING }],
};

export const createStatusList = (
  created: Date,
  stoppAutomatikk = defaultStoppAutomatikk
) => {
  return stoppAutomatikk.virksomhetNr.map((virksomhet) => {
    return {
      veilederIdent: {
        value: "A111111",
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
    };
  });
};
