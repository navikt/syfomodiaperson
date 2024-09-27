import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { personoppgaverMock } from "@/mocks/ispersonoppgave/personoppgaveMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubPersonoppgaveApi = () =>
  mockServer.use(
    http.get(`*${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`, () =>
      HttpResponse.json(personoppgaverMock())
    )
  );
