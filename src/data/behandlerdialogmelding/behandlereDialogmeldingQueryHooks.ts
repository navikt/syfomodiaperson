import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "react-query";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";

export const behandlereDialogmeldingQueryKeys = {
  behandleredialogmelding: (fnr: string) => ["behandleredialogmelding", fnr],
};

export const useBehandlereDialogmeldingQuery = () => {
  const { isDm2InnkallingFastlegeEnabled } = useDM2FeatureToggles();
  const fnr = useValgtPersonident();
  const fetchBehandlereDialogmelding = () =>
    get<BehandlerDialogmeldingDTO[]>(
      `${ISDIALOGMELDING_ROOT}/behandler/personident`,
      fnr
    );
  return useQuery(
    behandlereDialogmeldingQueryKeys.behandleredialogmelding(fnr),
    fetchBehandlereDialogmelding,
    { enabled: !!fnr && isDm2InnkallingFastlegeEnabled }
  );
};
