import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  ISMEROPPFOLGING_ROOT,
  MEROPPFOLGING_BACKEND_ROOT,
} from "@/apiConstants";
import { get } from "@/api/axios";
import {
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarStatusResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";
import { ApiErrorException } from "@/api/errors";

export const kartleggingssporsmalQueryKeys = {
  kartleggingssporsmalKandidat: (fnr: string) => [
    "kartleggingssporsmalKandidat",
    fnr,
  ],
  kartleggingssporsmalSvar: (fnr: string) => ["kartleggingssporsmalsvar", fnr],
};

export const useKartleggingssporsmalKandidatQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater`;
  const getKartleggingssporsmalKandidat = () =>
    get<KartleggingssporsmalKandidatResponseDTO>(path, fnr).catch(
      (error: ApiErrorException) => {
        if (error.code === 404) {
          return null;
        }
      }
    );

  return useQuery({
    queryKey: kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr),
    queryFn: getKartleggingssporsmalKandidat,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};

export const useKartleggingssporsmalSvarQuery = (isEnabled: boolean) => {
  const fnr = useValgtPersonident();
  const path = `${MEROPPFOLGING_BACKEND_ROOT}/kartleggingssporsmal/latest`;
  const getKartleggingssporsmalSvar = () =>
    get<KartleggingssporsmalSvarStatusResponseDTO>(path, fnr);

  return useQuery({
    queryKey: kartleggingssporsmalQueryKeys.kartleggingssporsmalSvar(fnr),
    queryFn: getKartleggingssporsmalSvar,
    enabled: !!fnr && isEnabled,
    staleTime: minutesToMillis(60 * 12),
  });
};
