import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import {
  behandlerByBehandlerRefMock,
  behandlereDialogmeldingMock,
  behandlerSokDialogmeldingMock,
} from "./behandlereDialogmeldingMock";
import { http, HttpResponse } from "msw";

export const mockIsdialogmelding = [
  http.get(`${ISDIALOGMELDING_ROOT}/behandler/personident`, () => {
    return HttpResponse.json(behandlereDialogmeldingMock);
  }),
  http.get(`${ISDIALOGMELDING_ROOT}/behandler/search`, () => {
    return HttpResponse.json(behandlerSokDialogmeldingMock);
  }),
  http.get(`${ISDIALOGMELDING_ROOT}/behandler/:behandlerRef`, () => {
    return HttpResponse.json(behandlerByBehandlerRefMock);
  }),
];
