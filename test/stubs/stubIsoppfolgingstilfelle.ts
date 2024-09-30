import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import { oppfolgingstilfellePersonMock } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubOppfolgingstilfellePersonApi = () =>
  mockServer.use(
    http.get(
      `*${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`,
      () => HttpResponse.json(oppfolgingstilfellePersonMock)
    )
  );
