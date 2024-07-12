import { ISMEROPPFOLGING_ROOT } from "../../src/apiConstants";
import express from "express";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "../../src/data/senoppfolging/senOppfolgingTypes";
import { generateUUID } from "../../src/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import { addWeeks } from "../../src/utils/datoUtils";

export const mockIsmeroppfolging = (server: any) => {
  server.get(
    `${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify([senOppfolgingKandidatMock]));
    }
  );
  server.post(
    `${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater/:kandidatUUID/vurderinger`,
    (req: express.Request, res: express.Response) => {
      res.send(JSON.stringify(ferdigbehandletKandidatMock));
    }
  );
};

export const senOppfolgingKandidatMock: SenOppfolgingKandidatResponseDTO = {
  uuid: generateUUID(),
  createdAt: new Date(),
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  status: SenOppfolgingStatus.KANDIDAT,
  vurderinger: [],
};

export const ferdigbehandletKandidatMock: SenOppfolgingKandidatResponseDTO = {
  ...senOppfolgingKandidatMock,
  createdAt: addWeeks(new Date(), -60),
  status: SenOppfolgingStatus.FERDIGBEHANDLET,
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: addWeeks(new Date(), -50),
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      veilederident: VEILEDER_IDENT_DEFAULT,
    },
  ],
};
