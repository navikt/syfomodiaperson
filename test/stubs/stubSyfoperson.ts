import nock from "nock";
import { SYFOPERSON_ROOT } from "@/apiConstants";

export const stubEgenansattApi = (scope: nock.Scope, isEgenansatt: boolean) =>
  scope
    .get(`${SYFOPERSON_ROOT}/person/egenansatt`)
    .reply(200, () => isEgenansatt);
