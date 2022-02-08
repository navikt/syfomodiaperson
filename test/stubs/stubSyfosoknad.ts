import nock from "nock";
import { SYFOSOKNAD_ROOT } from "@/apiConstants";
import { soknaderMock } from "../../mock/data/soknaderMock";

export const stubSyfosoknadApi = (scope: nock.Scope, fnr: string) =>
  scope
    .get(`${SYFOSOKNAD_ROOT}/soknader?fnr=${fnr}`)
    .reply(200, () => soknaderMock);
