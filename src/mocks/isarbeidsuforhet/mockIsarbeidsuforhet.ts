import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { mockArbeidsuforhetvurdering } from "./arbeidsuforhetMock";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { generateUUID } from "@/utils/utils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import { addStatusEndring } from "@/mocks/ispengestopp/mockIspengestopp";
import { stoppAutomatikkArbeidsuforhet } from "@/mocks/ispengestopp/pengestoppStatusMock";
import { minutesFromToday } from "../../../test/testUtils";

let arbeidsuforhetVurderinger = mockArbeidsuforhetvurdering;

export const mockIsarbeidsuforhet = [
  http.get(`${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`, () => {
    return HttpResponse.json(arbeidsuforhetVurderinger);
  }),

  http.post<object, VurderingRequestDTO>(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`,
    async ({ request }) => {
      const body = await request.json();
      const personident = request.headers[NAV_PERSONIDENT_HEADER];
      const varsel =
        body.type === "FORHANDSVARSEL"
          ? {
              uuid: generateUUID(),
              createdAt: new Date(),
              svarfrist: new Date(),
              isExpired: true,
            }
          : undefined;
      const sentVurdering: VurderingResponseDTO = {
        uuid: generateUUID(),
        personident:
          personident?.toString() ?? ARBEIDSTAKER_DEFAULT.personIdent,
        createdAt: new Date(),
        veilederident: VEILEDER_DEFAULT.ident,
        type: body.type,
        arsak: body.arsak,
        begrunnelse: body.begrunnelse,
        document: body.document,
        varsel,
      };
      arbeidsuforhetVurderinger = [sentVurdering, ...arbeidsuforhetVurderinger];

      if (body.type === "AVSLAG") {
        addStatusEndring({
          ...stoppAutomatikkArbeidsuforhet,
          opprettet: minutesFromToday(1).toISOString(),
        });
      }

      return HttpResponse.json(sentVurdering);
    }
  ),
];
