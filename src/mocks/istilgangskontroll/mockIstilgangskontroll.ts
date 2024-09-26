import { tilgangBrukerMock } from "./tilgangtilbrukerMock";
import { ISTILGANGSKONTROLL_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockIstilgangskontroll = http.get(
  `${ISTILGANGSKONTROLL_ROOT}/tilgang/navident/person`,
  () => {
    return HttpResponse.json(tilgangBrukerMock);
  }
);
