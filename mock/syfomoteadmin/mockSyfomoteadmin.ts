import express = require("express");
import { virksomhetMock } from "./virksomhetMock";
import { SYFOMOTEADMIN_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

const mockOpprettetIdResultat = () => {
  mockOpprettetIdResultat.rollingCounter += 1;
};
mockOpprettetIdResultat.rollingCounter = 100;

const mockForLokal = (server: any) => {
  server.get(
    `${SYFOMOTEADMIN_ROOT}/virksomhet/:virksomhetsnummer`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(virksomhetMock(req.params.virksomhetsnummer)));
    }
  );
};

export const mockSyfomoteadmin = (server: any) => {
  mockForLokal(server);
};
