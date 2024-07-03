import nock from "nock";
import { SYKEPENGEDAGER_INFORMASJON_ROOT } from "@/apiConstants";
import { maksdatoMock } from "../../mock/syfoperson/persondataMock";

export const stubMaxdateApi = (scope: nock.Scope, maxDate: string) => {
  const maksdato = {
    maxDate: {
      ...maksdatoMock.maxDate,
      forelopig_beregnet_slutt: maxDate,
    },
  };
  return scope
    .get(`${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`)
    .reply(200, () => maksdato);
};
