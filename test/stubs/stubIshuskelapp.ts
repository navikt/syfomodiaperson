import nock from "nock";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { OppfolgingsoppgaveResponseDTO } from "@/data/oppfolgingsoppgave/types";

export const stubHuskelappApi = (
  scope: nock.Scope,
  huskelapp: OppfolgingsoppgaveResponseDTO | undefined
) => {
  scope.get(`${ISHUSKELAPP_ROOT}/huskelapp`).reply(200, () => huskelapp);
};
