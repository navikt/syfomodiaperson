import nock from "nock";

export const stubEgenansattApi = (scope: nock.Scope, isEgenansatt: boolean) =>
  scope
    .get(`/syfoperson/api/v2/person/egenansatt`)
    .reply(200, () => isEgenansatt);
