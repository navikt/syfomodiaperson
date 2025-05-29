import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISMANGLENDEMEDVIRKNING_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";

export const manglendeMedvirkningQueryKeys = {
  manglendeMedvirkning: (personident: string) => [
    "manglendeMedvirkning",
    personident,
  ],
};

export const useManglendemedvirkningVurderingQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`;
  const fetchManglendeMedvirkning = () =>
    get<VurderingResponseDTO[]>(path, personident);

  const query = useQuery({
    queryKey: manglendeMedvirkningQueryKeys.manglendeMedvirkning(personident),
    queryFn: fetchManglendeMedvirkning,
    enabled: !!personident,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    sisteVurdering: query.data?.[0],
  };
};
