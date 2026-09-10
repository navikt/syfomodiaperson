import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { UnntaksvurderingDTO } from "@/sider/oppfolgingsplan/hooks/types/Unntaksvurdering";
import { SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { oppfolgingsplanQueryKeys } from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { minutesToMillis } from "@/utils/utils";

export const unntaksvurderingQueryKeys = {
  unntaksvurderinger: (personident: string) => [
    "unntaksvurderinger",
    personident,
  ],
};

export function useGetUnntaksvurderingerQuery() {
  const fnr = useValgtPersonident();
  const path = `${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/unntaksvurderinger/query`;
  const fetchUnntaksvurderinger = () =>
    post<UnntaksvurderingDTO>(path, { sykmeldtFnr: fnr });
  const query = useQuery({
    queryKey: oppfolgingsplanQueryKeys.unntaksvurderinger(fnr),
    queryFn: fetchUnntaksvurderinger,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data?.unntaksvurderinger || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
  };
}
