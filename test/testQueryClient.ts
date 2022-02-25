import { QueryClient } from "react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../mock/data/tilgangtilbrukerMock";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_DEFAULT,
} from "../mock/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";

export const queryClientWithMockData = (): QueryClient => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(
    veilederinfoQueryKeys.veilederinfo,
    () => VEILEDER_DEFAULT
  );
  queryClient.setQueryData(
    behandlendeEnhetQueryKeys.behandlendeEnhet(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => BEHANDLENDE_ENHET_DEFAULT
  );
  queryClient.setQueryData(
    tilgangQueryKeys.tilgang(ARBEIDSTAKER_DEFAULT.personIdent),
    () => tilgangBrukerMock
  );
  queryClient.setQueryData(
    ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
    () => LEDERE_DEFAULT
  );

  return queryClient;
};
