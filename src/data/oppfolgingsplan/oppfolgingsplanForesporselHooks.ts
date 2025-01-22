import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";
import { get, post } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface OppfolgingsplanForesporselResponse {
  uuid: string;
  createdAt: Date;
  arbeidstakerPersonident: string;
  veilederident: string;
  virksomhetsnummer: string;
  narmestelederPersonident: string;
}

export function useGetOppfolgingsplanForesporselQuery() {
  const personident = useValgtPersonident();

  const path = `${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`;
  const getOppfolgingsplanForesporsel = () =>
    get<OppfolgingsplanForesporselResponse[]>(path, personident);

  return useQuery({
    queryKey: oppfolgingsplanQueryKeys.foresporsel(personident),
    queryFn: getOppfolgingsplanForesporsel,
    enabled: !!personident,
  });
}

export interface NewOppfolgingsplanForesporselDTO {
  arbeidstakerPersonident: string;
  virksomhetsnummer: string;
  narmestelederPersonident: string;
  document: DocumentComponentDto[];
}

export function usePostOppfolgingsplanForesporsel() {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const path = `${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`;
  const postOppfolgingsplanForesporsel = (
    foresporsel: NewOppfolgingsplanForesporselDTO
  ) => post<NewOppfolgingsplanForesporselDTO>(path, foresporsel);

  return useMutation({
    mutationFn: postOppfolgingsplanForesporsel,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: oppfolgingsplanQueryKeys.foresporsel(personident),
      });
    },
  });
}
