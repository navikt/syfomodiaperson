import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";
import { get, post } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export const oppfolgingsplanForesporselQueryKeys = {
  foresporsel: (personident: string) => ["foresporsel", personident],
};

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
    queryKey: oppfolgingsplanForesporselQueryKeys.foresporsel(personident),
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
  ) => post<OppfolgingsplanForesporselResponse>(path, foresporsel);

  return useMutation({
    mutationFn: postOppfolgingsplanForesporsel,
    onSuccess: (createdForesporsel: OppfolgingsplanForesporselResponse) => {
      console.log(oppfolgingsplanForesporselQueryKeys.foresporsel(personident));
      queryClient.setQueryData(
        oppfolgingsplanForesporselQueryKeys.foresporsel(personident),
        (oldData: OppfolgingsplanForesporselResponse[]) => [
          createdForesporsel,
          ...oldData,
        ]
      );
    },
  });
}
