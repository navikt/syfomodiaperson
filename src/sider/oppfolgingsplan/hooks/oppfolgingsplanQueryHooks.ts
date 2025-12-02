import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { get, post } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { DokumentinfoDTO } from "@/sider/oppfolgingsplan/hooks/types/DokumentinfoDTO";
import { useMemo } from "react";
import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import { minutesToMillis } from "@/utils/utils";
import {
  OppfolgingsplanV2DTO,
  OppfolgingsplanV2RequestBody,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";

export const oppfolgingsplanQueryKeys = {
  oppfolgingsplanerV2: (personident: string) => [
    "oppfolgingsplanerV2",
    personident,
  ],
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

export function useGetOppfolgingsplanerV2Query() {
  const fnr = useValgtPersonident();
  const path = `${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/query`;
  const payload: OppfolgingsplanV2RequestBody = {
    sykmeldtFnr: fnr,
  };
  const fetchOppfolgingsplanerV2 = () =>
    post<OppfolgingsplanV2DTO[]>(path, payload);
  const query = useQuery({
    queryKey: oppfolgingsplanQueryKeys.oppfolgingsplanerV2(fnr),
    queryFn: fetchOppfolgingsplanerV2,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
  };
}

export function useDokumentinfoQuery(oppfolgingsplanId: number) {
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/${oppfolgingsplanId}/dokumentinfo`;
  const fetchDokumentinfo = () => get<DokumentinfoDTO>(path);
  return useQuery({
    queryKey: oppfolgingsplanQueryKeys.dokumentinfo(oppfolgingsplanId),
    queryFn: fetchDokumentinfo,
    staleTime: minutesToMillis(60 * 12),
  });
}
