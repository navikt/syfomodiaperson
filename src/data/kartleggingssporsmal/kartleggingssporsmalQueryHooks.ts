import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  ISMEROPPFOLGING_ROOT,
  MEROPPFOLGING_BACKEND_V1_ROOT,
} from "@/apiConstants";
import { get, put } from "@/api/axios";
import {
  isKandidat,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarResponseDTO,
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

export const useKartleggingssporsmalSvarQuery = (
  kandidat: KartleggingssporsmalKandidatResponseDTO | null | undefined
) => {
  const fnr = useValgtPersonident();
  const path = `${MEROPPFOLGING_BACKEND_V1_ROOT}/kartleggingssporsmal/kandidat/${kandidat?.kandidatUuid}/svar`;
  const getKartleggingssporsmalSvar = () =>
    get<KartleggingssporsmalSvarResponseDTO>(path);

  return useQuery({
    queryKey: kartleggingssporsmalQueryKeys.kartleggingssporsmalSvar(fnr),
    queryFn: getKartleggingssporsmalSvar,
    enabled: !!fnr && isKandidat(kandidat),
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
