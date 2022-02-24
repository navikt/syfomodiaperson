import nock from "nock";
import { SYFOSMREGISTER_ROOT } from "@/apiConstants";
import { sykmeldingerMock } from "../../mock/data/sykmeldingerMock";

export const stubSykmeldingApi = (scope: nock.Scope) =>
  scope
    .get(`${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`)
    .reply(200, () => sykmeldingerMock);
