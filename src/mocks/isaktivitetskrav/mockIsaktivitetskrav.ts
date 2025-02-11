import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { aktivitetskravMock } from "./aktivitetskravMock";
import {
  AktivitetskravDTO,
  AktivitetskravHistorikkDTO,
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  CreateAktivitetskravVurderingDTO,
  InnstillingOmStansVurderingDTO,
  NewVurderingDTO,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { daysFromToday } from "../../../test/testUtils";
import { generateUUID } from "@/utils/utils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import { aktivitetskravHistorikkMock } from "./aktivitetskravHistorikkMock";
import { http, HttpResponse } from "msw";

let mockAktivitetskrav: AktivitetskravDTO[] = aktivitetskravMock;
let aktivitetskravHistorikk: AktivitetskravHistorikkDTO[] =
  aktivitetskravHistorikkMock;

export const mockIsaktivitetskrav = [
  http.get(`${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`, () => {
    return HttpResponse.json(mockAktivitetskrav);
  }),
  http.get(`${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/historikk`, () => {
    return HttpResponse.json(aktivitetskravHistorikk);
  }),
  http.post<object, NewVurderingDTO>(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/:aktivitetskravUuid/vurder`,
    async ({ request }) => {
      const body = await request.json();
      const newVurdering: AktivitetskravVurderingDTO =
        toAktivitetskravVurderingDTO(body);
      let firstAktivitetskrav = mockAktivitetskrav.shift() as AktivitetskravDTO;
      firstAktivitetskrav = {
        ...firstAktivitetskrav,
        status: body.status,
        inFinalState:
          body.status !== AktivitetskravStatus.AVVENT &&
          body.status !== AktivitetskravStatus.FORHANDSVARSEL &&
          body.status !== AktivitetskravStatus.NY &&
          body.status !== AktivitetskravStatus.NY_VURDERING,
        vurderinger: [newVurdering, ...firstAktivitetskrav.vurderinger],
      };
      mockAktivitetskrav = [firstAktivitetskrav, ...mockAktivitetskrav];
      aktivitetskravHistorikk = [
        {
          tidspunkt: new Date(),
          status: body.status,
          vurdertAv: VEILEDER_DEFAULT.ident,
        },
        ...aktivitetskravHistorikk,
      ];
      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.post<object, SendForhandsvarselDTO>(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/:aktivitetskravUuid/forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      const forhandsvarsel = {
        uuid: "123",
        createdAt: new Date(),
        svarfrist: daysFromToday(21),
        document: body.document,
      };
      const newForhandsvarselVurdering: AktivitetskravVurderingDTO = {
        uuid: generateUUID(),
        status: AktivitetskravStatus.FORHANDSVARSEL,
        arsaker: [],
        beskrivelse: body.fritekst,
        createdAt: new Date(),
        createdBy: VEILEDER_DEFAULT.ident,
        stansFom: undefined,
        frist: daysFromToday(21),
        varsel: forhandsvarsel,
      };
      let firstAktivitetskrav = mockAktivitetskrav.shift() as AktivitetskravDTO;
      firstAktivitetskrav = {
        ...firstAktivitetskrav,
        vurderinger: [
          newForhandsvarselVurdering,
          ...firstAktivitetskrav.vurderinger,
        ],
      };
      mockAktivitetskrav = [firstAktivitetskrav, ...mockAktivitetskrav];
      aktivitetskravHistorikk = [
        {
          tidspunkt: new Date(),
          status: newForhandsvarselVurdering.status,
          vurdertAv: VEILEDER_DEFAULT.ident,
        },
        ...aktivitetskravHistorikk,
      ];
      return new HttpResponse(null, { status: 201 });
    }
  ),
];

export function toAktivitetskravVurderingDTO(
  newVurdering: NewVurderingDTO
): AktivitetskravVurderingDTO {
  switch (newVurdering.status) {
    case AktivitetskravStatus.INNSTILLING_OM_STANS:
      const newInnstillingOmStansVurdering =
        newVurdering as InnstillingOmStansVurderingDTO;
      return {
        uuid: generateUUID(),
        status: newInnstillingOmStansVurdering.status,
        arsaker: [],
        beskrivelse: newInnstillingOmStansVurdering.beskrivelse,
        createdAt: new Date(),
        createdBy: VEILEDER_DEFAULT.ident,
        stansFom: newInnstillingOmStansVurdering.stansFom,
        frist: undefined,
        varsel: undefined,
      };
    default:
      const newVurderingDTO = newVurdering as CreateAktivitetskravVurderingDTO;
      return {
        uuid: generateUUID(),
        status: newVurderingDTO.status,
        arsaker: [...newVurderingDTO.arsaker],
        beskrivelse: newVurderingDTO.beskrivelse,
        createdAt: new Date(),
        createdBy: VEILEDER_DEFAULT.ident,
        stansFom: undefined,
        frist: undefined,
        varsel: undefined,
      };
  }
}
