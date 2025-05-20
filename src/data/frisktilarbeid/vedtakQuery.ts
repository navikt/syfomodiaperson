import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import {
  VedtakResponseDTO,
  VilkarResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";

export const vedtakQueryKeys = {
  vedtak: (personident: string) => ["frisktilarbeid-vedtak", personident],
  vilkar: (personident: string) => ["frisktilarbeid-vilkar", personident],
};

export const useVedtakQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`;
  const fetchVedtak = () => get<VedtakResponseDTO[]>(path, personident);

  const query = useQuery({
    queryKey: vedtakQueryKeys.vedtak(personident),
    queryFn: fetchVedtak,
    enabled: !!personident,
  });

  return {
    isPending: query.isPending,
    isError: query.isError,
    data: query.data || [],
  };
};

export const useVilkarForVedtakQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak-vilkar`;
  const fetchVedtak = () => get<VilkarResponseDTO>(path, personident);

  const query = useQuery({
    queryKey: vedtakQueryKeys.vilkar(personident),
    queryFn: fetchVedtak,
    enabled: !!personident,
  });

  return {
    isPending: query.isPending,
    data: query.data,
    isRegisteredArbeidssoker: query.data?.isArbeidssoker,
  };
};
