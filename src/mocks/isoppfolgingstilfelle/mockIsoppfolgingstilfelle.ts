import { oppfolgingstilfellePersonMock } from "./oppfolgingstilfellePersonMock";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockIsoppfolgingstilfelle = http.get(
  `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`,
  () => {
    return HttpResponse.json(oppfolgingstilfellePersonMock);
  }
);
