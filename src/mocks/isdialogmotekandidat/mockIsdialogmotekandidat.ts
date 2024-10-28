import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { dialogmotekandidatMock } from "./dialogmotekandidatMock";
import {
  dialogmoteunntakMock,
  unntaksstatistikk,
} from "./dialogmoteunntakMock";
import { http, HttpResponse } from "msw";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants";

export const mockIsdialogmotekandidat = [
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`, () => {
    return HttpResponse.json(dialogmotekandidatMock);
  }),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/historikk`, () => {
    return HttpResponse.json([
      {
        tidspunkt: "2019-04-15T00:00:00",
        type: "KANDIDAT",
        vurdertAv: null,
      },
      {
        tidspunkt: "2019-04-20T00:00:00",
        type: "UNNTAK",
        vurdertAv: VEILEDER_IDENT_DEFAULT,
      },
    ]);
  }),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`, () => {
    return HttpResponse.json(dialogmoteunntakMock);
  }),
  http.post(`${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/statistikk`, () => {
    return HttpResponse.json(unntaksstatistikk);
  }),
];
