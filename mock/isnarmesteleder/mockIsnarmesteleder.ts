import { ledereMock } from "../data/ledereMock";
import { ISNARMESTELEDER_ROOT } from "../../src/apiConstants";

const Auth = require("../../server/auth/index.js");

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
