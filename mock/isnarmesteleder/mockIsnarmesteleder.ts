import { ledereMock } from "./ledereMock";
import { ISNARMESTELEDER_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockIsnarmesteleder = (server) => {
  server.get(
    `${ISNARMESTELEDER_ROOT}/narmestelederrelasjon/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(ledereMock));
    }
  );
};
