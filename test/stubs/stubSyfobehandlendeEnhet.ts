import nock from "nock";
import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";

export const stubBehandlendeEnhetApi = (
  scope: nock.Scope,
  enhet?: BehandlendeEnhet
) =>
  scope.get(`${SYFOBEHANDLENDEENHET_ROOT}/personident`).reply(200, () => enhet);
