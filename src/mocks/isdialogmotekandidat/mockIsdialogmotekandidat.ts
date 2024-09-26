import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { dialogmotekandidatMock } from "./dialogmotekandidatMock";
import {
  dialogmoteunntakMock,
  unntaksstatistikk,
} from "./dialogmoteunntakMock";
import { http, HttpResponse } from "msw";

export const mockIsdialogmotekandidat = [
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`, () => {
    return HttpResponse.json(dialogmotekandidatMock);
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
