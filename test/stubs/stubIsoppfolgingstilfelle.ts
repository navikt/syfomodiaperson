import nock from "nock";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import { oppfolgingstilfellePersonMock } from "../../mock/data/oppfolgingstilfellePersonMock";

export const stubOppfolgingstilfellePersonApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`)
    .reply(200, () => oppfolgingstilfellePersonMock);
};
