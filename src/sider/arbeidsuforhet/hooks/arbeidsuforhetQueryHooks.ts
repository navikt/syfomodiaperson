import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";

export const arbeidsuforhetQueryKeys = {
  arbeidsuforhet: (personident: string) => ["arbeidsuforhet", personident],
};

export function useGetArbeidsuforhetVurderingerQuery() {
  const personident = useValgtPersonident();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`;
  const fetchArbeidsuforhet = () =>
    get<VurderingResponseDTO[]>(path, personident);

  const query = useQuery({
    queryKey: arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
    queryFn: fetchArbeidsuforhet,
    enabled: !!personident,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
