import { ISHUSKELAPP_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import { HuskelappDto } from "@/data/huskelapp/huskelappTypes";

const huskelappMock: HuskelappDto = {
  tekst: "Dette er en veldig fin tekst",
};
export const mockIshuskelapp = (server: any) => {
  server.get(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(huskelappMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );
};
