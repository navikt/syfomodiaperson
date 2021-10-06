import { veilederMock } from "../../mock/data/veilederMock";
import nock from "nock";

export const stubVeilederinfoApi = (scope: nock.Scope) =>
  scope
    .get(`/syfoveileder/api/v2/veileder/self`)
    .reply(200, () => veilederMock);
