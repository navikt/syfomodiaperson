import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  parseSoknad,
  SoknaderQueryDTO,
  SoknaderResponseDTO,
  SoknadDTO,
  SoknadIkkeAktuellPostDTO,
  SoknadIkkeAktuellResponseDTO,
  SoknadVedtakPostDTO,
  SoknadVedtakResponseDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";

export const utenlandsoppholdQueryKeys = {
  soknader: (personident: string) => ["utenlandsoppholdSoknader", personident],
  vedtakMutation: (soknadId: string) => ["vedtakMutation", soknadId],
  ikkeAktuellMutation: (soknadId: string) => ["ikkeAktuellMutation", soknadId],
};

/**
 * Erstatter søknaden med gitt id i den bufrede søknadslisten. Delt mellom
 * vedtaks- og ikke-aktuell-mutasjonene, som begge oppdaterer én søknad i
 * listen etter at backend har returnert den ferdigbehandlede søknaden.
 */
function oppdaterSoknadICache(
  queryClient: ReturnType<typeof useQueryClient>,
  personident: string,
  oppdatertSoknad: SoknadDTO,
) {
  queryClient.setQueryData(
    utenlandsoppholdQueryKeys.soknader(personident),
    (oldData: SoknaderResponseDTO | undefined) => {
      if (!oldData) return oldData;

      return {
        soknader: oldData.soknader.map((soknad) =>
          soknad.soknadId === oppdatertSoknad.soknadId
            ? oppdatertSoknad
            : soknad,
        ),
      };
    },
  );
}

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
      oppdaterSoknadICache(queryClient, personident, data.soknad);
    },
  });
};

/**
 * Setter en søknad til «Ikke aktuell» med en oppgitt årsak. I motsetning til
 * `useVedtakMutation` genererer ikke denne handlingen noe brev eller
 * dokument, og sender derfor ikke noe til sykmeldte.
 */
export const useIkkeAktuellMutation = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = (soknadId: string) =>
    `${ISUTENLANDSOPPHOLD_ROOT}/soknader/${soknadId}/ikke-aktuell`;
  const postIkkeAktuell = ({
    soknadIdPathParam,
    ikkeAktuell,
  }: {
    soknadIdPathParam: string;
    ikkeAktuell: SoknadIkkeAktuellPostDTO;
  }) =>
    post<SoknadIkkeAktuellResponseDTO>(
      path(soknadIdPathParam),
      ikkeAktuell,
      personident,
    );

  return useMutation({
    mutationFn: postIkkeAktuell,
    onSuccess: (data: SoknadIkkeAktuellResponseDTO) => {
      oppdaterSoknadICache(queryClient, personident, data.soknad);
    },
  });
};
