import { ISHUSKELAPP_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import express from "express";
import {
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";

let huskelappMock: OppfolgingsoppgaveResponseDTO | undefined = undefined;
const huskelappUuid = generateUUID();
export const mockIshuskelapp = (server: any) => {
  server.get(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        !!huskelappMock
          ? res.send(JSON.stringify(huskelappMock))
          : res.sendStatus(204);
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    (req: express.Request, res: express.Response) => {
      const body = req.body as OppfolgingsoppgaveRequestDTO;
      huskelappMock = {
        uuid: huskelappUuid,
        createdBy: VEILEDER_IDENT_DEFAULT,
        updatedAt: new Date(),
        createdAt: new Date(),
        oppfolgingsgrunn: body.oppfolgingsgrunn,
        frist: body.frist,
      };
      res.sendStatus(200);
    }
  );
  server.delete(
    `${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`,
    (req: express.Request, res: express.Response) => {
      huskelappMock = undefined;
      res.sendStatus(204);
    }
  );
};
