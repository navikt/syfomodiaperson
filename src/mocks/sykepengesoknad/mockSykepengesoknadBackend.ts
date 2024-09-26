import { soknaderMock } from "./soknaderMock";
import { SYKEPENGESOKNAD_BACKEND_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockSykepengesoknadBackend = http.post(
  `${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader`,
  () => {
    return HttpResponse.json(soknaderMock);
  }
);
