import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { oppfolgingstilfellePersonMock } from "./oppfolgingstilfellePersonMock";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockIsoppfolgingstilfelle = (server) => {
  server.get(
    `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(oppfolgingstilfellePersonMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
};
