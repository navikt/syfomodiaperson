import nock from "nock";
import { virksomhetMock } from "../../mock/data/virksomhetMock";
import { SYFOMOTEADMIN_ROOT } from "@/apiConstants";

export const stubVirksomhetApi = (scope: nock.Scope, orgnummer: string) =>
  scope
    .get(`${SYFOMOTEADMIN_ROOT}/virksomhet/${orgnummer}`)
    .reply(200, () => virksomhetMock());
