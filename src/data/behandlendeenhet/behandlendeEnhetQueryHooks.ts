import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { useQuery } from "react-query";

export const behandlendeEnhetQueryKeys = {
  behandlendeEnhet: (fnr: string) => ["behandlendeenhet", fnr],
};

export const useBehandlendeEnhetQuery = (fnr: string) => {
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/personident`;
  const fetchBehandlendeEnhet = () => get<BehandlendeEnhet>(path, fnr);
  return useQuery(
    behandlendeEnhetQueryKeys.behandlendeEnhet(fnr),
    fetchBehandlendeEnhet,
    { enabled: !!fnr }
  );
};
