import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";
import { sorterMotebehovDataEtterDatoDesc } from "@/utils/motebehovUtils";

export const motebehovQueryKeys = {
  motebehov: (fnr: string) => ["motebehov", fnr],
};

export const useMotebehovQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOMOTEBEHOV_ROOT}/motebehov`;
  const fetchMotebehov = () => get<MotebehovVeilederDTO[]>(path, fnr);

  const query = useQuery({
    queryKey: motebehovQueryKeys.motebehov(fnr),
    queryFn: fetchMotebehov,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data?.sort(sorterMotebehovDataEtterDatoDesc) || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
