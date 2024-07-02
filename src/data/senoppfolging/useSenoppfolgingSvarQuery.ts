import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { MEROPPFOLGING_BACKEND_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

export const senOppfolgingSvarQueryKeys = {
  senOppfolgingSvar: (fnr: string) => ["senOppfolgingSvar", fnr],
};

export const useSenOppfolgingSvarQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${MEROPPFOLGING_BACKEND_ROOT}/senoppfolging/formresponse`;
  const fetchSenOppfolgingSvar = () => get<string>(path, fnr); // TODO: Fix correct DTO type when api is ready

  return useQuery({
    queryKey: senOppfolgingSvarQueryKeys.senOppfolgingSvar(fnr),
    queryFn: fetchSenOppfolgingSvar,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
