import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  parseSoknad,
  SoknaderQueryDTO,
  SoknaderResponseDTO,
  SoknadVedtakPostDTO,
  SoknadVedtakResponseDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";

export const utenlandsoppholdQueryKeys = {
  soknader: (personident: string) => ["utenlandsoppholdSoknader", personident],
  vedtakMutation: (soknadId: string) => ["vedtakMutation", soknadId],
};

/**
 * Henter søknader på § 8-9 utenlandsopphold for en person fra vår backend.
 * Endepunktet er en POST på personident, men brukes som en GET.
 */
export const useUtenlandsoppholdSoknanderQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`;
  const requestDTO: SoknaderQueryDTO = { personident };
  const fetchSoknader = () => post<SoknaderResponseDTO>(path, requestDTO);

  return useQuery({
    queryKey: utenlandsoppholdQueryKeys.soknader(personident),
    queryFn: fetchSoknader,
    enabled: !!personident,
    select: (data) => ({
      soknader: data.soknader.map(parseSoknad),
    }),
  });
};

export const useVedtakMutation = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = (soknadId: string) =>
    `${ISUTENLANDSOPPHOLD_ROOT}/soknader/${soknadId}/vedtak`;
  const postVedtak = ({
    soknadIdPathParam,
    vedtak,
  }: {
    soknadIdPathParam: string;
    vedtak: SoknadVedtakPostDTO;
  }) =>
    post<SoknadVedtakResponseDTO>(path(soknadIdPathParam), vedtak, personident);

  return useMutation({
    mutationFn: postVedtak,
    onSuccess: (data: SoknadVedtakResponseDTO) => {
      queryClient.setQueryData(
        utenlandsoppholdQueryKeys.soknader(personident),
        (oldData: SoknaderResponseDTO | undefined) => {
          if (!oldData) return oldData;

          return {
            soknader: oldData.soknader.map((soknad) =>
              soknad.soknadId === data.soknad.soknadId ? data.soknad : soknad,
            ),
          };
        },
      );
    },
  });
};
