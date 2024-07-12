import express = require("express");
import { VEILARBOPPFOLGING_ROOT } from "../../src/apiConstants";
import { UnderArbeidsrettetOppfolgingResponseDTO } from "../../src/data/veilarboppfolging/veilarboppfolgingTypes";

export const mockVeilarboppfolging = (server: any) => {
  server.post(
    `${VEILARBOPPFOLGING_ROOT}/hent-underOppfolging`,
    (req: express.Request, res: express.Response) => {
      res.status(200).send(JSON.stringify(underArbeidsrettetOppfolgingMock));
    }
  );
};

export const underArbeidsrettetOppfolgingMock: UnderArbeidsrettetOppfolgingResponseDTO =
  {
    underOppfolging: true,
  };
