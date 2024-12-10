import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISMEROPPFOLGING_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { SenOppfolgingKandidatResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";

export const senOppfolgingKandidatQueryKeys = {
  senOppfolgingKandidat: (fnr: string) => ["senOppfolgingKandidat", fnr],
};

export const useSenOppfolgingKandidatQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater`;
  const getSenOppfolgingKandidat = () =>
    get<SenOppfolgingKandidatResponseDTO[]>(path, fnr);

  const query = useQuery({
    queryKey: senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(fnr),
    queryFn: getSenOppfolgingKandidat,
    enabled: !!fnr,
    refetchOnWindowFocus: true,
    staleTime: minutesToMillis(5),
  });

  return {
    ...query,
    data: query.data || [],
  };
};
