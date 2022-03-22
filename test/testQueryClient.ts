import { QueryClient } from "react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../mock/data/tilgangtilbrukerMock";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import {
  AKTIV_BRUKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_DEFAULT,
} from "../mock/common/mockConstants";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { modiacontextQueryKeys } from "@/data/modiacontext/modiacontextQueryHooks";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { oppfolgingstilfellePersonMock } from "../mock/data/oppfolgingstilfellePersonMock";

export const queryClientWithAktivBruker = (): QueryClient => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(
    modiacontextQueryKeys.aktivbruker,
    () => AKTIV_BRUKER_DEFAULT
  );

  return queryClient;
};

export const queryClientWithMockData = (): QueryClient => {
  const queryClient = queryClientWithAktivBruker();
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
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
      ARBEIDSTAKER_DEFAULT.personIdent
    ),
    () => oppfolgingstilfellePersonMock
  );

  return queryClient;
};
