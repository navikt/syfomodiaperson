import express = require("express");
import { ISDIALOGMELDING_ROOT } from "../../src/apiConstants";
import Auth = require("../../server/auth");
import { behandlereDialogmeldingMock } from "./behandlereDialogmeldingMock";

export const mockIsdialogmelding = (server: any) => {
  server.get(
    `${ISDIALOGMELDING_ROOT}/behandler/personident`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(behandlereDialogmeldingMock));
    }
  );
};
