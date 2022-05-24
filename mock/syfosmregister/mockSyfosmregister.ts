import express = require("express");
import { sykmeldingerMock } from "./sykmeldingerMock";
import { SYFOSMREGISTER_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockSyfosmregister = (server: any) => {
  server.get(
    `${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(sykmeldingerMock));
    }
  );
};
