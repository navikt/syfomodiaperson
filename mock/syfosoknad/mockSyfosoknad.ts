import { soknaderMock } from "./soknaderMock";
import { SYFOSOKNAD_ROOT } from "../../src/apiConstants";

const Auth = require("../../server/auth/index.js");

export const mockSyfosoknad = (server) => {
  server.get(
    `${SYFOSOKNAD_ROOT}/soknader`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(soknaderMock));
    }
  );
};
