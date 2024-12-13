import { motebehovMock } from "./motebehovMock";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";

export const mockSyfomotebehov = [
  http.get(`${SYFOMOTEBEHOV_ROOT}/motebehov`, () => {
    return HttpResponse.json(motebehovMock);
  }),

  http.post(`${SYFOMOTEBEHOV_ROOT}/motebehov/:fnr/behandle`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${SYFOMOTEBEHOV_ROOT}/motebehov/:fnr/behandle`, () => {
    const oppdaterteMotebehov = motebehovMock.map((motebehov) => {
      motebehov.behandletTidspunkt = new Date();
      motebehov.behandletVeilederIdent = VEILEDER_IDENT_DEFAULT;
    });

    Object.assign(motebehovMock, ...oppdaterteMotebehov);

    return new HttpResponse(null, { status: 200 });
  }),
];
