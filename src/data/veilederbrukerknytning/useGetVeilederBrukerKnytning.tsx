import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";

export const veilederBrukerKnytningQueryKeys = {
  veilederBrukerKnytning: (personident: string) => [
    "veilederBrukerKnytning",
    personident,
  ],
};

export function useGetVeilederBrukerKnytning() {
  const personident = useValgtPersonident();
  const path = `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`;
  const getVeilederBrukerKnytning = () =>
    get<VeilederBrukerKnytningDTO>(path, personident);

  return useQuery({
    queryKey:
      veilederBrukerKnytningQueryKeys.veilederBrukerKnytning(personident),
    queryFn: getVeilederBrukerKnytning,
    enabled: !!personident,
  });
}

export interface VeilederBrukerKnytningDTO {
  personident: string;
  tildeltVeilederident?: string;
  tildeltEnhet?: string;
}
