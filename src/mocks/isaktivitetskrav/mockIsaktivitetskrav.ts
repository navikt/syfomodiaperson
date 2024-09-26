import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { aktivitetskravMock } from "./aktivitetskravMock";
import {
  AktivitetskravDTO,
  AktivitetskravHistorikkDTO,
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  CreateAktivitetskravVurderingDTO,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { daysFromToday } from "../../../test/testUtils";
import { generateUUID } from "@/utils/uuidUtils";
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
  http.post<object, CreateAktivitetskravVurderingDTO>(
    `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/:aktivitetskravUuid/vurder`,
    async ({ request }) => {
      const body = await request.json();
      const newVurdering: AktivitetskravVurderingDTO = {
        uuid: generateUUID(),
        status: body.status,
        arsaker: [...body.arsaker],
        beskrivelse: body.beskrivelse,
        createdAt: new Date(),
        createdBy: VEILEDER_DEFAULT.ident,
        frist: undefined,
        varsel: undefined,
      };
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
