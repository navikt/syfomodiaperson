import express = require("express");
import { ISMANGLENDEMEDVIRKNING_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";

import { generateUUID } from "../../src/utils/uuidUtils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import {
  NewVurderingRequestDTO,
  VurderingResponseDTO,
} from "../../src/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { addDays } from "../../src/utils/datoUtils";

let manglendeMedvirkningVurderinger: VurderingResponseDTO[] = [];

export const mockIsmanglendemedvirkning = (server: any) => {
  server.get(
    `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`,
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.send(JSON.stringify(manglendeMedvirkningVurderinger));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.post(
    `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`,
    (req: express.Request, res: express.Response) => {
      const body: NewVurderingRequestDTO = req.body;
      const varsel =
        body.vurderingType === "FORHANDSVARSEL"
          ? {
              uuid: generateUUID(),
              createdAt: addDays(new Date(), -1),
              svarfrist: addDays(new Date(), -1),
            }
          : null;
      const sentVurdering: VurderingResponseDTO = {
        uuid: generateUUID(),
        createdAt: new Date(),
        personident: body.personident,
        vurderingType: body.vurderingType,
        veilederident: VEILEDER_DEFAULT.ident,
        begrunnelse: body.begrunnelse,
        document: body.document,
        varsel: varsel,
      };
      manglendeMedvirkningVurderinger = [
        sentVurdering,
        ...manglendeMedvirkningVurderinger,
      ];
      res.status(201).send(JSON.stringify(sentVurdering));
    }
  );
};
