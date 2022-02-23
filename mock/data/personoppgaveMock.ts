import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { leggTilDagerPaDato } from "../util/dateUtil";

const getDefaultPersonOppgaveUbehandlet = (created: Date) => {
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
    referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: "OPPFOLGINGSPLANLPS",
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    opprettet: leggTilDagerPaDato(created, -1).toJSON(),
  };
};

const getPersonOppgaveBehandlet = (created: Date) => {
  return {
    ...getDefaultPersonOppgaveUbehandlet,
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
    behandletTidspunkt: leggTilDagerPaDato(created, -1).toJSON(),
    behandletVeilederIdent: "Z991100",
    opprettet: leggTilDagerPaDato(created, -10).toJSON(),
  };
};

export const personoppgaverMock = (created: Date) => {
  return [
    getDefaultPersonOppgaveUbehandlet(created),
    getPersonOppgaveBehandlet(created),
  ];
};
