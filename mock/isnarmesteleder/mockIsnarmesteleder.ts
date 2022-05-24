import express = require("express");
import { ledereMock } from "./ledereMock";
import { ISNARMESTELEDER_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockIsnarmesteleder = (server: any) => {
  server.get(
    `${ISNARMESTELEDER_ROOT}/narmestelederrelasjon/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(ledereMock));
    }
  );
};
