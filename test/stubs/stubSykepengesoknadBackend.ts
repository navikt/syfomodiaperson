import { SYKEPENGESOKNAD_BACKEND_ROOT } from "@/apiConstants";
import { soknaderMock } from "@/mocks/sykepengesoknad/soknaderMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubSykepengesoknadBackendApi = () =>
  mockServer.use(
    http.post(`*${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader`, () =>
      HttpResponse.json(soknaderMock)
    )
  );
