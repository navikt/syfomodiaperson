import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  ISMEROPPFOLGING_ROOT,
  MEROPPFOLGING_BACKEND_V1_ROOT,
} from "@/apiConstants";
import { get, put } from "@/api/axios";
import {
  hasAnsweredKartleggingssporsmal,
  KartleggingssporsmalKandidatResponseDTO,
  KartleggingssporsmalSvarResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";
import { ApiErrorException } from "@/api/errors";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

export const kartleggingssporsmalQueryKeys = {
  kartleggingssporsmalKandidat: (fnr: string) => [
    "kartleggingssporsmalKandidat",
    fnr,
  ],
  kartleggingssporsmalSvar: (fnr: string) => ["kartleggingssporsmalSvar", fnr],
};

export const useKartleggingssporsmalKandidatQuery = () => {
  const { toggles } = useFeatureToggles();
  const fnr = useValgtPersonident();
  const path = `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater`;
  // TODO: clean up after updating endpoint in ismeroppfolging
  const getKartleggingssporsmalKandidat = () =>
    get<
      | KartleggingssporsmalKandidatResponseDTO
      | KartleggingssporsmalKandidatResponseDTO[]
    >(path, fnr)
      .then((data) => (Array.isArray(data) ? data : [data]))
      .catch((error: ApiErrorException) => {
        if (error.code === 404) {
          return [];
        }
        throw error;
      });

  return useQuery({
    queryKey: kartleggingssporsmalQueryKeys.kartleggingssporsmalKandidat(fnr),
    queryFn: getKartleggingssporsmalKandidat,
    enabled: !!fnr && toggles.isKartleggingssporsmalEnabled,
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
    enabled: !!fnr && hasAnsweredKartleggingssporsmal(kandidat),
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
