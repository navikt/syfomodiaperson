import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  ISOPPFOLGINGSPLAN_ROOT,
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { get, post } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { DokumentinfoDTO } from "@/data/oppfolgingsplan/types/DokumentinfoDTO";
import { useMemo } from "react";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { minutesToMillis } from "@/utils/utils";

export const oppfolgingsplanQueryKeys = {
  oppfolgingsplaner: (personident: string) => [
    "oppfolgingsplaner",
    personident,
  ],
  oppfolgingsplanerLPS: (personident: string) => [
    "oppfolgingsplanerLPS",
    personident,
  ],
  dokumentinfo: (id: number) => ["dokumentinfo", id],
  foresporsel: (personident: string) => ["foresporsel", personident],
};

export const useOppfolgingsplanerQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan`;
  const fetchOppfolgingsplaner = () => get<OppfolgingsplanDTO[]>(path, fnr);
  const query = useQuery({
    queryKey: oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
    queryFn: fetchOppfolgingsplaner,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    data: query.data || [],
    aktivePlaner: useMemo(
      () =>
        query.data?.filter(
          (plan) =>
            plan.status !== "AVBRUTT" &&
            new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) > new Date()
        ) || [],
      [query.data]
    ),
  };
};

export const useOppfolgingsplanerLPSQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`;
  const fetchOppfolgingsplanerLPS = () => get<OppfolgingsplanLPS[]>(path, fnr);
  const query = useQuery({
    queryKey: oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(fnr),
    queryFn: fetchOppfolgingsplanerLPS,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    data: query.data || [],
  };
};

export const useDokumentinfoQuery = (oppfolgingsplanId: number) => {
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/${oppfolgingsplanId}/dokumentinfo`;
  const fetchDokumentinfo = () => get<DokumentinfoDTO>(path);
  return useQuery({
    queryKey: oppfolgingsplanQueryKeys.dokumentinfo(oppfolgingsplanId),
    queryFn: fetchDokumentinfo,
    staleTime: minutesToMillis(60 * 12),
  });
};

export interface ExistingOppfolgingsplanForesporselDTO {
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
    get<ExistingOppfolgingsplanForesporselDTO>(path, personident);

  return useQuery({
    queryKey: oppfolgingsplanQueryKeys.foresporsel(personident),
    queryFn: getOppfolgingsplanForesporsel,
    enabled: !!personident,
  });
}

export interface NewOppfolgingsplanForesporselDTO {
  arbeidstakerPersonident: string;
  veilederident: string;
  virksomhetsnummer: string;
  narmestelederPersonident: string;
}

export function usePostOppfolgingsplanForesporselQuery() {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const path = `${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`;
  const postOppfolgingsplanForesporsel = (
    foresporselDTO: NewOppfolgingsplanForesporselDTO
  ) => post<NewOppfolgingsplanForesporselDTO>(path, foresporselDTO);

  return useMutation({
    mutationFn: postOppfolgingsplanForesporsel,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: oppfolgingsplanQueryKeys.foresporsel(personident),
      });
    },
  });
}
