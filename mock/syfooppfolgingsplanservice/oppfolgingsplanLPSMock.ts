import { leggTilDagerPaDato } from "../util/dateUtil";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";

const getDefaultOppfolgingsplanLPS = (created: Date) => {
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    opprettet: leggTilDagerPaDato(created, -1).toJSON(),
    sistEndret: leggTilDagerPaDato(created, -1).toJSON(),
  };
};

export const oppfolgingsplanerLPSMock = (created: Date) => {
  return [
    getDefaultOppfolgingsplanLPS(created),
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
      opprettet: leggTilDagerPaDato(created, -10).toJSON(),
      sistEndret: leggTilDagerPaDato(created, -10).toJSON(),
    },
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd4",
      opprettet: created.toJSON(),
      sistEndret: created.toJSON(),
    },
  ];
};
