import { ISPENGESTOPP_ROOT } from "../../src/apiConstants";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";

const Auth = require("../../server/auth/index.js");

const Status = {
  NORMAL: "NORMAL",
  STOPP_AUTOMATIKK: "STOPP_AUTOMATIKK",
};

const createStatusList = (stoppAutomatikk) => {
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
      opprettet: new Date().toISOString(),
      enhetNr: {
        value: "1337",
      },
    };
  });
};

export const mockIspengestopp = (server) => {
  let STATUSLIST = undefined;

  server.get(
    `${ISPENGESTOPP_ROOT}/person/status`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      if (!STATUSLIST) {
        res.sendStatus(204);
      } else {
        res.send(JSON.stringify(STATUSLIST));
      }
    }
  );
  server.post(
    `${ISPENGESTOPP_ROOT}/person/flagg`,
    Auth.ensureAuthenticated(),
    (req, res) => {
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
    }
  );
};
