import nock from "nock";
import { virksomhetMock } from "../../mock/data/virksomhetMock";

export const stubVirksomhetApi = (scope: nock.Scope, orgnummer: string) =>
  scope
    .get(`/syfomoteadmin/api/internad/v2/virksomhet/${orgnummer}`)
    .reply(200, () => virksomhetMock());
