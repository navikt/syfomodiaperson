import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

export const behandlereQueryKeys = {
  behandlere: (fnr: string) => ["behandlere", fnr],
};

export const useBehandlereQuery = () => {
  const fnr = useValgtPersonident();
  const fetchBehandlere = () =>
    get<BehandlerDTO[]>(`${ISDIALOGMELDING_ROOT}/behandler/personident`, fnr);
  const query = useQuery(behandlereQueryKeys.behandlere(fnr), fetchBehandlere, {
    enabled: !!fnr,
  });

  return {
    ...query,
    data: query.data || [],
  };
};
