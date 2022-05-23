import { sykmeldingerMock } from "./sykmeldingerMock";
import { SYFOSMREGISTER_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockSyfosmregister = (server) => {
  server.get(
    `${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(sykmeldingerMock));
    }
  );
};
