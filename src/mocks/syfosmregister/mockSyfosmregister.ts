import { sykmeldingerMock } from "./sykmeldingerMock";
import { SYFOSMREGISTER_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockSyfosmregister = http.get(
  `${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`,
  () => {
    return HttpResponse.json(sykmeldingerMock);
  }
);
