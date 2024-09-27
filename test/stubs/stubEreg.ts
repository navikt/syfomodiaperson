import { virksomhetMock } from "@/mocks/ereg/virksomhetMock";
import { EREG_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubVirksomhetApi = (orgnummer: string) =>
  mockServer.use(
    http.get(`*${EREG_ROOT}/organisasjon/${orgnummer}`, () =>
      HttpResponse.json(virksomhetMock())
    )
  );
