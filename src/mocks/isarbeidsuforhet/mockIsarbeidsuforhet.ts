import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { mockArbeidsuforhetvurdering } from "./arbeidsuforhetMock";
import {
  ArbeidsuforhetVurderingRequestDTO,
  Avslag,
  AvslagUtenForhandsvarsel,
  IkkeAktuell,
  VurderingResponseDTO,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { generateUUID } from "@/utils/utils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import { http, HttpResponse } from "msw";

let arbeidsuforhetVurderinger = mockArbeidsuforhetvurdering;

export const mockIsarbeidsuforhet = [
  http.get(`${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`, () => {
    return HttpResponse.json(arbeidsuforhetVurderinger);
  }),

  http.post<object, ArbeidsuforhetVurderingRequestDTO>(
    `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`,
    async ({ request }) => {
      const body = await request.json();
      const personident = request.headers[NAV_PERSONIDENT_HEADER];
      const arsak =
        body.type === "IKKE_AKTUELL" ? (body as IkkeAktuell).arsak : undefined;
      const stansGjelderFom =
        body.type === "AVSLAG" || body.type === "AVSLAG_UTEN_FORHANDSVARSEL"
          ? (body as Avslag | AvslagUtenForhandsvarsel).gjelderFom
          : undefined;
      const oppgaveFraNayDato =
        body.type === "AVSLAG_UTEN_FORHANDSVARSEL"
          ? (body as AvslagUtenForhandsvarsel).oppgaveFraNayDato
          : undefined;
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
        arsak: arsak,
        begrunnelse: body.begrunnelse,
        document: body.document,
        gjelderFom: stansGjelderFom,
        oppgaveFraNayDato: oppgaveFraNayDato,
        varsel,
      };
      arbeidsuforhetVurderinger = [sentVurdering, ...arbeidsuforhetVurderinger];

      return HttpResponse.json(sentVurdering);
    }
  ),
];
