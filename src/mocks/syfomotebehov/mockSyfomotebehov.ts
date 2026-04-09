import { getMotebehovMock } from "./motebehovMock";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockSyfomotebehov = [
  http.get(`${SYFOMOTEBEHOV_ROOT}/motebehov`, () => {
    return HttpResponse.json(getMotebehovMock());
  }),
];
