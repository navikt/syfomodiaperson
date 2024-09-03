import express = require("express");
import { SYFOVEILEDER_ROOT } from "../../src/apiConstants";
import { ANNEN_VEILEDER, VEILEDER_DEFAULT } from "../common/mockConstants";

const veiledereMock = [VEILEDER_DEFAULT, ANNEN_VEILEDER];

export const mockSyfoveileder = (server: any) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/self`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(VEILEDER_DEFAULT));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veiledereMock));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/:ident`,
    (req: express.Request, res: express.Response) => {
      const { ident } = req.params;
      const veileder = veiledereMock.find(
        (veileder) => veileder.ident === ident
      );

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(veileder));
    }
  );
};
