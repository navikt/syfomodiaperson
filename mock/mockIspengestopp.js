const Status = {
  NORMAL: "NORMAL",
  STOPP_AUTOMATIKK: "STOPP_AUTOMATIKK",
};

function createStatusList(stoppAutomatikk) {
  return stoppAutomatikk.virksomhetNr.map((virksomhet) => {
    return {
      veilederIdent: {
        value: "A111111",
      },
      sykmeldtFnr: {
        value: "11011011011",
      },
      status: Status.STOPP_AUTOMATIKK,
      virksomhetNr: {
        value: virksomhet.value,
      },
      opprettet: new Date().toISOString(),
      enhetNr: {
        value: "1337",
      },
    };
  });
}

function mockForLokal(server) {
  let STATUSLIST = undefined;

  server.get("/ispengestopp/api/v1/person/status", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!STATUSLIST) {
      res.sendStatus(204);
    } else {
      res.send(JSON.stringify(STATUSLIST));
    }
  });
  server.post("/ispengestopp/api/v1/person/flagg", (req, res) => {
    const body = req.body;
    STATUSLIST = createStatusList(body);

    const stoppAutomatikk =
      body.sykmeldtFnr && body.virksomhetNr && body.enhetNr;
    console.assert(stoppAutomatikk, {
      stoppAutomatikk,
      errorMsg: "invalid stoppAutomatikk object",
    });
    res.sendStatus(201);
    console.log("StoppAutomatikk: 201 CREATED");
  });
}

function mockIspengestopp(server) {
  mockForLokal(server);
}

module.exports = mockIspengestopp;
