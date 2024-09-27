import { oppfolgingsplanMock } from "./oppfolgingsplanMock";
import { historikkoppfolgingsplanMock } from "./historikkoppfolgingsplanMock";
import {
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { dokumentinfoMock } from "./dokumentinfoMock";
import { http, HttpResponse } from "msw";

export const mockSyfooppfolgingsplanservice = [
  http.get(`${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan`, () => {
    return HttpResponse.json(oppfolgingsplanMock);
  }),

  http.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/historikk`,
    () => {
      return HttpResponse.json(historikkoppfolgingsplanMock);
    }
  ),

  http.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/:id/dokumentinfo`,
    () => {
      return HttpResponse.json(dokumentinfoMock);
    }
  ),
];
