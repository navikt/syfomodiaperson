import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "react-query";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

// TODO: Ta i bruk i DM2 MVP-inngang hvis dm2InnkallingFastlege feature toggle er enabled
export const useBehandlereDialogmeldingQuery = (fnr: string) => {
  const fetchBehandlereDialogmelding = () =>
    get<BehandlerDialogmeldingDTO[]>(
      `${ISDIALOGMELDING_ROOT}/behandler/personident`,
      fnr
    );
  return useQuery(
    ["behandleredialogmelding", fnr],
    fetchBehandlereDialogmelding
  );
};
