import { leggTilDagerPaDato } from "../util/dateUtil";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";

const getDefaultOppfolgingsplanLPS = () => {
  const today = new Date();
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: leggTilDagerPaDato(today, -1).toJSON(),
    sistEndret: leggTilDagerPaDato(today, -1).toJSON(),
  };
};

export const oppfolgingsplanerLPSMock = () => {
  const today = new Date();
  return [
    getDefaultOppfolgingsplanLPS(),
    {
      ...getDefaultOppfolgingsplanLPS(),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
      opprettet: leggTilDagerPaDato(today, -10).toJSON(),
    },
  ];
};
