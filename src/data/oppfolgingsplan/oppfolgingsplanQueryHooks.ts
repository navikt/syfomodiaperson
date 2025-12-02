import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
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

export function useGetOppfolgingsplanerQuery() {
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
    data: query.data || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
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
}

export function useGetLPSOppfolgingsplanerQuery() {
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
    data: query.data || [],
    isPending: query.isPending,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export const useDokumentinfoQuery = (oppfolgingsplanId: number) => {
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/${oppfolgingsplanId}/dokumentinfo`;
  const fetchDokumentinfo = () => get<DokumentinfoDTO>(path);
  return useQuery({
    queryKey: oppfolgingsplanQueryKeys.dokumentinfo(oppfolgingsplanId),
    queryFn: fetchDokumentinfo,
    staleTime: minutesToMillis(60 * 12),
  });
};
