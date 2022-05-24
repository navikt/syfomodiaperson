import { soknaderMock } from "./soknaderMock";
import { SYKEPENGESOKNAD_BACKEND_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockSykepengesoknadBackend = (server) => {
  server.get(
    `${SYKEPENGESOKNAD_BACKEND_ROOT}/soknader`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(soknaderMock));
    }
  );
};
