import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  ISMEROPPFOLGING_ROOT,
  MEROPPFOLGING_BACKEND_ROOT,
} from "@/apiConstants";
import { get } from "@/api/axios";
import {
  KartleggingssporsmalsvarStatusResponseDTO,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartlegging/kartleggingTypes";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const kartleggingssporsmalQueryKeys = {
  kartleggingssporsmalKandidat: (fnr: string) => [
    "kartleggingssporsmalKandidat",
    fnr,
  ],
  kartleggingssporsmalsvar: (fnr: string) => ["kartleggingssporsmalsvar", fnr],
};

export const useKartleggingssporsmalKandidatQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater`;
  const getKartleggingssporsmalKandidat = () =>
    get<KartleggingssporsmalKandidatResponseDTO>(path, fnr);

  return useQuery({
    queryKey: kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr),
    queryFn: getKartleggingssporsmalKandidat,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};

export const useKartleggingssporsmalsvarQuery = (isEnabled: boolean) => {
  const fnr = useValgtPersonident();
  const path = `${MEROPPFOLGING_BACKEND_ROOT}/kartleggingssporsmal/latest`;
  const getKartleggingssporsmalsvar = () =>
    get<KartleggingssporsmalsvarStatusResponseDTO>(path, fnr);

  return useQuery({
    queryKey: kartleggingssporsmalQueryKeys.kartleggingssporsmalsvar(fnr),
    queryFn: getKartleggingssporsmalsvar,
    enabled: !!fnr && isEnabled,
    staleTime: minutesToMillis(60 * 12),
  });
};
