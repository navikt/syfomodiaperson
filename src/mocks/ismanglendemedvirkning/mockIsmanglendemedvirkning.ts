import { ISMANGLENDEMEDVIRKNING_ROOT } from "@/apiConstants";

import { generateUUID } from "@/utils/uuidUtils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import {
  NewVurderingRequestDTO,
  VurderingResponseDTO,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { addDays } from "@/utils/datoUtils";
import { http, HttpResponse } from "msw";

let manglendeMedvirkningVurderinger: VurderingResponseDTO[] = [];

export const mockIsmanglendemedvirkning = [
  http.get(
    `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`,
    () => {
      return HttpResponse.json(manglendeMedvirkningVurderinger);
    }
  ),

  http.post<object, NewVurderingRequestDTO>(
    `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`,
    async ({ request }) => {
      const body = await request.json();
      const varsel =
        body.vurderingType === "FORHANDSVARSEL"
          ? {
              uuid: generateUUID(),
              createdAt: addDays(new Date(), -1),
              svarfrist: addDays(new Date(), -1),
            }
          : null;
      const stansdato =
        body.vurderingType === "STANS" ? body.stansdato : undefined;
      const sentVurdering: VurderingResponseDTO = {
        uuid: generateUUID(),
        createdAt: new Date(),
        personident: body.personident,
        vurderingType: body.vurderingType,
        veilederident: VEILEDER_DEFAULT.ident,
        begrunnelse: body.begrunnelse,
        document: body.document,
        stansdato: stansdato,
        varsel: varsel,
      };
      manglendeMedvirkningVurderinger = [
        sentVurdering,
        ...manglendeMedvirkningVurderinger,
      ];

      return HttpResponse.json(sentVurdering);
    }
  ),
];
