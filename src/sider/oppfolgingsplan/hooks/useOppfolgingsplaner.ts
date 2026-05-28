import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerQuery,
  useGetOppfolgingsplanerV2Query,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import {
  OppfolgingsplanDTO,
  partitionOppfolgingsplanerByAktivPlan,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import {
  OppfolgingsplanV2DTO,
  partitionOppfolgingsplanerByActiveTilfelle,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export interface OppfolgingsplanerResult {
  aktivePlaner: OppfolgingsplanDTO[];
  inaktivePlaner: OppfolgingsplanDTO[];
  aktivePlanerV2: OppfolgingsplanV2DTO[];
  inaktivePlanerV2: OppfolgingsplanV2DTO[];
  allePlanerV2: OppfolgingsplanV2DTO[];
  lpsPlaner: OppfolgingsplanLPS[];
  isLoading: boolean;
  isError: boolean;
  latestOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
  hasActiveOppfolgingstilfelle: boolean;
}

/**
 * Samle-hook for alle oppfølgingsplaner (V1, V2 og LPS).
 * Partisjonerer V1- og V2-planer i aktive og inaktive basert på gjeldende oppfølgingstilfelle.
 * LPS-planer returneres urørt — konsumenten kobler personoppgaver selv ved behov.
 */
export function useOppfolgingsplaner(): OppfolgingsplanerResult {
  const getOppfolgingsplanerQuery = useGetOppfolgingsplanerQuery();
  const getLPSOppfolgingsplanerQuery = useGetLPSOppfolgingsplanerQuery();
  const getOppfolgingsplanerV2Query = useGetOppfolgingsplanerV2Query();
  const { latestOppfolgingstilfelle, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();

  const [aktivePlaner, inaktivePlaner] = partitionOppfolgingsplanerByAktivPlan(
    getOppfolgingsplanerQuery.data
  );

  const [aktivePlanerV2, inaktivePlanerV2] = latestOppfolgingstilfelle
    ? partitionOppfolgingsplanerByActiveTilfelle(
        getOppfolgingsplanerV2Query.data,
        latestOppfolgingstilfelle
      )
    : [[], []];

  return {
    aktivePlaner,
    inaktivePlaner,
    aktivePlanerV2,
    inaktivePlanerV2,
    allePlanerV2: getOppfolgingsplanerV2Query.data,
    lpsPlaner: getLPSOppfolgingsplanerQuery.data,
    isLoading:
      getOppfolgingsplanerQuery.isLoading ||
      getLPSOppfolgingsplanerQuery.isLoading ||
      getOppfolgingsplanerV2Query.isLoading,
    isError:
      getOppfolgingsplanerQuery.isError ||
      getLPSOppfolgingsplanerQuery.isError ||
      getOppfolgingsplanerV2Query.isError,
    latestOppfolgingstilfelle,
    hasActiveOppfolgingstilfelle,
  };
}
