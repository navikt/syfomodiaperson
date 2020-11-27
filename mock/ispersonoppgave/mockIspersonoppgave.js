const NAV_PERSONIDENT_HEADER = "nav-personident";

const dateUtil = require("../util/dateUtil");

const getDefaultPersonOppgaveUbehandlet = () => {
  const today = new Date();
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
    referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: "11011011011",
    virksomhetsnummer: "110110110",
    type: "OPPFOLGINGSPLANLPS",
    behandletTidspunkt: null,
    behandletVeilederIdent: null,
    opprettet: dateUtil.leggTilDagerPaDato(today, -1).toJSON(),
  };
};

const getPersonOppgaveBehandlet = () => {
  const today = new Date();
  return {
    ...getDefaultPersonOppgaveUbehandlet,
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
    behandletTidspunkt: dateUtil.leggTilDagerPaDato(today, -1).toJSON(),
    behandletVeilederIdent: "Z991100",
    opprettet: dateUtil.leggTilDagerPaDato(today, -10).toJSON(),
  };
};

function getPersonOppgaver() {
  return [getDefaultPersonOppgaveUbehandlet(), getPersonOppgaveBehandlet()];
}
function mockForLokal(server) {
  server.get(
    "/ispersonoppgave/api/v1/personoppgave/personident",
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
    "/ispersonoppgave/api/v1/personoppgave/:uuid/behandle",
    (req, res) => {
      res.sendStatus(200);
    }
  );
}

function mockIspersonoppgave(server) {
  mockForLokal(server);
}

module.exports = mockIspersonoppgave;
