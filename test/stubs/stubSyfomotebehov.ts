import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { historikkmotebehovMock } from "@/mocks/syfomotebehov/historikkmotebehovMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubMotebehovHistorikkApi = () =>
  mockServer.use(
    http.get(`*${SYFOMOTEBEHOV_ROOT}/historikk`, () =>
      HttpResponse.json(historikkmotebehovMock)
    )
  );
