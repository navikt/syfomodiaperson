import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";

export const dialogmoteunntakQueryKeys = {
  unntak: (personident: string) => ["dialogmoteunntak", personident],
};

export const useGetDialogmoteunntakQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`;
  const fetchUnntak = () => get<UnntakDTO[]>(path, personident);
  const query = useQuery({
    queryKey: dialogmoteunntakQueryKeys.unntak(personident),
    queryFn: fetchUnntak,
    enabled: !!personident,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
