import nock from "nock";
import { SYFOTILGANGSKONTROLL_ROOT } from "@/apiConstants";
import { tilgangBrukerMock } from "../../mock/data/tilgangtilbrukerMock";

export const stubTilgangApi = (
  scope: nock.Scope,
  tilgangMock = tilgangBrukerMock
) => {
  return scope
    .get(`${SYFOTILGANGSKONTROLL_ROOT}/tilgang/navident/person`)
    .reply(200, () => tilgangMock);
};
