import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "react-query";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

export const behandlereDialogmeldingQueryKeys = {
  behandleredialogmelding: (fnr: string) => ["behandleredialogmelding", fnr],
};

export const useBehandlereDialogmeldingQuery = (fnr: string) => {
  const fetchBehandlereDialogmelding = () =>
    get<BehandlerDialogmeldingDTO[]>(
      `${ISDIALOGMELDING_ROOT}/behandler/personident`,
      fnr
    );
  return useQuery(
    behandlereDialogmeldingQueryKeys.behandleredialogmelding(fnr),
    fetchBehandlereDialogmelding,
    { enabled: !!fnr }
  );
};
