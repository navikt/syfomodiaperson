import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";

export const veilederBrukerKnytningQueryKeys = {
  veilederBrukerKnytning: (personident: string) => [
    "veilederBrukerKnytning",
    personident,
  ],
  historikk: (personident: string) => ["historikk", personident],
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

export const useVeilederHistorikk = () => {
  const personident = useValgtPersonident();
  const path = `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/historikk`;
  const fetchHistorikk = () => get<[VeilederHistorikkDTO]>(path, personident);
  return useQuery({
    queryKey: veilederBrukerKnytningQueryKeys.historikk(personident),
    queryFn: fetchHistorikk,
    enabled: !!personident,
  });
};

export interface VeilederBrukerKnytningDTO {
  personident: string;
  tildeltVeilederident?: string;
  tildeltEnhet?: string;
}

export interface VeilederHistorikkDTO {
  tildeltDato: Date;
  tildeltVeileder: string;
  tildeltEnhet: string;
  tildeltAv: string;
}
