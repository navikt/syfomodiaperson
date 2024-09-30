import { ISTILGANGSKONTROLL_ROOT } from "@/apiConstants";
import { tilgangBrukerMock } from "@/mocks/istilgangskontroll/tilgangtilbrukerMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubTilgangApi = (tilgangMock = tilgangBrukerMock) =>
  mockServer.use(
    http.get(`*${ISTILGANGSKONTROLL_ROOT}/tilgang/navident/person`, () =>
      HttpResponse.json(tilgangMock)
    )
  );
