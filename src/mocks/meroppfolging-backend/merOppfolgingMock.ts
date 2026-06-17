import {
  MEROPPFOLGING_BACKEND_V1_ROOT,
  MEROPPFOLGING_BACKEND_V2_ROOT,
} from "@/apiConstants";
import { http, HttpResponse } from "msw";
import { snartSluttPaSykepengeneMock } from "@/mocks/meroppfolging-backend/snartSluttPaSykepengeneMockData.ts";
import { kartleggingssporsmalFlervalgFritekstV3Answered } from "@/mocks/meroppfolging-backend/kartleggingssporsmalMockData.ts";

export const mockMerOppfolging = [
  http.get(
    `${MEROPPFOLGING_BACKEND_V2_ROOT}/senoppfolging/formresponse`,
    () => {
      return HttpResponse.json(snartSluttPaSykepengeneMock);
    }
  ),
  http.get(
    `${MEROPPFOLGING_BACKEND_V1_ROOT}/kartleggingssporsmal/kandidat/:kandidatUUID/svar`,
    () => {
      return HttpResponse.json(kartleggingssporsmalFlervalgFritekstV3Answered);
    }
  ),
];
