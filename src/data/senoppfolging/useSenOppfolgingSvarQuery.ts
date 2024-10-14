import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { MEROPPFOLGING_BACKEND_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { SenOppfolgingFormResponseDTOV2 } from "@/data/senoppfolging/senOppfolgingTypes";

export const senOppfolgingSvarQueryKeys = {
  senOppfolgingSvar: (fnr: string) => ["senOppfolgingSvar", fnr],
};

export const useSenOppfolgingSvarQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${MEROPPFOLGING_BACKEND_ROOT}/senoppfolging/formresponse`;
  const getSenOppfolgingSvar = () =>
    get<SenOppfolgingFormResponseDTOV2 | undefined>(path, fnr);

  return useQuery({
    queryKey: senOppfolgingSvarQueryKeys.senOppfolgingSvar(fnr),
    queryFn: getSenOppfolgingSvar,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
