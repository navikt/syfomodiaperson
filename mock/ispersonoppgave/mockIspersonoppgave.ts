import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { ISPERSONOPPGAVE_ROOT } from "../../src/apiConstants";
import { personoppgaverMock } from "./personoppgaveMock";

const Auth = require("../../server/auth/index.js");

export const mockIspersonoppgave = (server) => {
  server.get(
    `${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(personoppgaverMock(new Date())));
      } else {
        res.status(400).send();
      }
    }
  );

  server.post(
    `${ISPERSONOPPGAVE_ROOT}/personoppgave/:uuid/behandle`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.sendStatus(200);
    }
  );
};
