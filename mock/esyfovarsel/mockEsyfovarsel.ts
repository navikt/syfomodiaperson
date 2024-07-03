import express = require("express");
import { SYKEPENGEDAGER_INFORMASJON_ROOT } from "@/apiConstants";
import { maksdatoMock } from "../syfoperson/persondataMock";

export const mockEsyfovarsel = (server: any) => {
  server.get(
    `${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(maksdatoMock));
    }
  );
};
