import { SYFOSMREGISTER_ROOT } from "@/apiConstants";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";

export const stubSykmeldingApi = () =>
  mockServer.use(
    http.get(`*${SYFOSMREGISTER_ROOT}/sykmeldinger`, () =>
      HttpResponse.json(sykmeldingerMock)
    )
  );
