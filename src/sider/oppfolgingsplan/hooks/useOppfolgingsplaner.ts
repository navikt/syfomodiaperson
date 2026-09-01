import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerV2Query,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import {
  OppfolgingsplanV2DTO,
  partitionOppfolgingsplanerByActiveTilfelle,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

export interface OppfolgingsplanerResult {
  aktivePlanerV2: OppfolgingsplanV2DTO[];
  inaktivePlanerV2: OppfolgingsplanV2DTO[];
  allePlanerV2: OppfolgingsplanV2DTO[];
  lpsPlaner: OppfolgingsplanLPS[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Samle-hook for alle oppfølgingsplaner (V2 og LPS).
 * Partisjonerer V2-planer i aktive og inaktive basert på gjeldende oppfølgingstilfelle.
 * LPS-planer returneres urørt — konsumenten kobler personoppgaver selv ved behov.
 */
export function useOppfolgingsplaner(): OppfolgingsplanerResult {
  const getLPSOppfolgingsplanerQuery = useGetLPSOppfolgingsplanerQuery();
  const getOppfolgingsplanerV2Query = useGetOppfolgingsplanerV2Query();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const [aktivePlanerV2, inaktivePlanerV2] = latestOppfolgingstilfelle
    ? partitionOppfolgingsplanerByActiveTilfelle(
        getOppfolgingsplanerV2Query.data,
        latestOppfolgingstilfelle,
      )
    : [[], []];

  return {
    aktivePlanerV2,
    inaktivePlanerV2,
    allePlanerV2: getOppfolgingsplanerV2Query.data,
    lpsPlaner: getLPSOppfolgingsplanerQuery.data,
    isLoading:
      getLPSOppfolgingsplanerQuery.isLoading ||
      getOppfolgingsplanerV2Query.isLoading,
    isError:
      getLPSOppfolgingsplanerQuery.isError ||
      getOppfolgingsplanerV2Query.isError,
  };
}
