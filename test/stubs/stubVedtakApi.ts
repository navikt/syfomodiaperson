import nock from "nock";
import { VEDTAK_ROOT } from "@/apiConstants";
import { vedtakMock } from "../../mock/data/vedtakMock";

export const stubVedtakApi = (scope: nock.Scope, fnr: string) =>
  scope.get(`${VEDTAK_ROOT}?fnr=${fnr}`).reply(200, () => vedtakMock);
