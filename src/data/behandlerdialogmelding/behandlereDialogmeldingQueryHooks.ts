import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "react-query";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const behandlereDialogmeldingQueryKeys = {
  behandleredialogmelding: (fnr: string) => ["behandleredialogmelding", fnr],
};

export const useBehandlereDialogmeldingQuery = () => {
  const fnr = useValgtPersonident();
  const fetchBehandlereDialogmelding = () =>
    get<BehandlerDialogmeldingDTO[]>(
      `${ISDIALOGMELDING_ROOT}/behandler/personident`,
      fnr
    );
  const query = useQuery(
    behandlereDialogmeldingQueryKeys.behandleredialogmelding(fnr),
    fetchBehandlereDialogmelding,
    { enabled: !!fnr }
  );

  return {
    ...query,
    data: query.data || [],
  };
};
