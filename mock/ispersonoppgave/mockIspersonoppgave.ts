import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { leggTilDagerPaDato } from "../util/dateUtil";

const getDefaultPersonOppgaveUbehandlet = () => {
  const today = new Date();
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
    referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: "19026900010",
    virksomhetsnummer: "110110110",
    type: "OPPFOLGINGSPLANLPS",
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    opprettet: leggTilDagerPaDato(today, -1).toJSON(),
  };
};

const getPersonOppgaveBehandlet = () => {
  const today = new Date();
  return {
    ...getDefaultPersonOppgaveUbehandlet,
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
    behandletTidspunkt: leggTilDagerPaDato(today, -1).toJSON(),
    behandletVeilederIdent: "Z991100",
    opprettet: leggTilDagerPaDato(today, -10).toJSON(),
  };
};

const getPersonOppgaver = () => {
  return [getDefaultPersonOppgaveUbehandlet(), getPersonOppgaveBehandlet()];
};

export const mockIspersonoppgave = (server) => {
  server.get(
    "/ispersonoppgave/api/get/v1/personoppgave/personident",
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(getPersonOppgaver()));
      } else {
        res.status(400).send();
      }
    }
  );

  server.post(
    "/ispersonoppgave/api/post/v1/personoppgave/:uuid/behandle",
    (req, res) => {
      res.sendStatus(200);
    }
  );
};
