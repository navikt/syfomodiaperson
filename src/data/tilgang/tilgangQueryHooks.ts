import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOTILGANGSKONTROLL_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "react-query";
import { Tilgang } from "@/data/tilgang/tilgangTypes";

export const tilgangQueryKeys = {
  tilgang: (fnr: string) => ["tilgang", fnr],
};

export const useTilgangQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOTILGANGSKONTROLL_ROOT}/tilgang/navident/person`;
  const fetchTilgang = () => get<Tilgang>(path, fnr);
  return useQuery(tilgangQueryKeys.tilgang(fnr), fetchTilgang, {
    enabled: !!fnr,
  });
};
