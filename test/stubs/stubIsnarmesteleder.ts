import { ISNARMESTELEDER_ROOT } from "@/apiConstants";
import { ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH } from "@/data/leder/ledereQueryHooks";
import nock from "nock";

export const stubNarmestelederApi = (scope: nock.Scope, ledere: any) => {
  return scope
    .get(
      `${ISNARMESTELEDER_ROOT}${ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH}`
    )
    .reply(200, () => ledere);
};
