import { ISPENGESTOPP_ROOT } from "../../src/apiConstants";
import { createStatusList } from "./pengestoppStatusMock";

const Auth = require("../../server/auth/index.js");

export const mockIspengestopp = (server) => {
  let STATUSLIST;

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
      STATUSLIST = createStatusList(new Date(), body);

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
