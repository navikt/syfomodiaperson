import { veilederMock } from "./veilederMock";
import { SYFOVEILEDER_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockSyfoveileder = (server) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veileder/self`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veilederMock));
    }
  );
};
