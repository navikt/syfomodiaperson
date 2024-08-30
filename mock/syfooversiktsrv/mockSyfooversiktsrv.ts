import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import { VEILEDER_BRUKER_KNYTNING_DEFAULT } from "../common/mockConstants";

let veilederBrukerKnytningMock = VEILEDER_BRUKER_KNYTNING_DEFAULT;

export const mockSyfooversiktsrv = (server: any) => {
  server.get(
    `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(veilederBrukerKnytningMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.post(
    `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/registrer`,
    (req: express.Request, res: express.Response) => {
      const body = req.body;
      const { veilederIdent } = body.tilknytninger[0];
      veilederBrukerKnytningMock = {
        ...veilederBrukerKnytningMock,
        tildeltVeilederident: veilederIdent,
      };
      res.sendStatus(200);
    }
  );
};
