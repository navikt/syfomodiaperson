import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  ISMEROPPFOLGING_ROOT,
  MEROPPFOLGING_BACKEND_ROOT,
} from "@/apiConstants";
import { get, put } from "@/api/axios";
import {
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarStatusResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";
import { ApiErrorException } from "@/api/errors";

export const kartleggingssporsmalQueryKeys = {
  kartleggingssporsmalKandidat: (fnr: string) => [
    "kartleggingssporsmalKandidat",
    fnr,
  ],
  kartleggingssporsmalSvar: (fnr: string) => ["kartleggingssporsmalSvar", fnr],
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
    staleTime: minutesToMillis(5),
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
    staleTime: minutesToMillis(5),
  });
};

export const useKartleggingssporsmalVurderSvar = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const postVurderSvar = (kandidatUuid: string) => {
    const path = `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater/${kandidatUuid}`;
    return put<KartleggingssporsmalKandidatResponseDTO>(path, {}, fnr);
  };
  const kartleggingssporsmalKandidatQueryKey =
    kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr);

  return useMutation({
    mutationFn: postVurderSvar,
    onSuccess: (data: KartleggingssporsmalKandidatResponseDTO) => {
      return queryClient.setQueryData(
        kartleggingssporsmalKandidatQueryKey,
        data
      );
    },
  });
};
