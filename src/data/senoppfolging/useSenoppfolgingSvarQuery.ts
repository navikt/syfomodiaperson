import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { MEROPPFOLGING_BACKEND_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

export const senoppfolgingSvarQueryKeys = {
  senoppfolgingSvar: (fnr: string) => ["senoppfolgingSvar", fnr],
};

export const useSenoppfolgingSvarQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${MEROPPFOLGING_BACKEND_ROOT}/senoppfolging/formresponse`;
  const fetchSenoppfolgingSvar = () => get<string>(path, fnr); // TODO: Fix correct DTO type when api is ready

  return useQuery({
    queryKey: senoppfolgingSvarQueryKeys.senoppfolgingSvar(fnr),
    queryFn: fetchSenoppfolgingSvar,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
