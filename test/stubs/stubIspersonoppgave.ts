import nock from "nock";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { personoppgaverMock } from "../../mock/data/personoppgaveMock";

export const stubPersonoppgaveApi = (scope: nock.Scope, created: Date) => {
  return scope
    .get(`${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`)
    .reply(200, () => personoppgaverMock(created));
};
