import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO as ArbeidsuforhetVurderinger,
  VurderingType,
  VurderingType as ArbeidsuforhetVurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function arbeidsuforhetText(
  veilederident: string,
  vurderingType: ArbeidsuforhetVurderingType
): string {
  switch (vurderingType) {
    case ArbeidsuforhetVurderingType.FORHANDSVARSEL:
      return veilederident + " sendte forhåndsvarsel";
    case ArbeidsuforhetVurderingType.OPPFYLT:
      return veilederident + " vurderte oppfylt";
    case ArbeidsuforhetVurderingType.AVSLAG:
      return veilederident + " vurderte avslag";
    case ArbeidsuforhetVurderingType.IKKE_AKTUELL:
      return veilederident + " vurderte ikke aktuell";
    case VurderingType.OPPFYLT_UTEN_FORHANDSVARSEL:
      return veilederident + " vurderte oppfylt uten forhåndsvarsel";
    case VurderingType.AVSLAG_UTEN_FORHANDSVARSEL:
      return (
        veilederident + " vurderte innstilling om avslag uten forhåndsvarsel"
      );
  }
}

function createHistorikkEventsFromArbeidsuforhet(
  arbeidsuforhetVurderinger: ArbeidsuforhetVurderinger[]
): HistorikkEvent[] {
  return arbeidsuforhetVurderinger.map(
    (vurdering: ArbeidsuforhetVurderinger) => {
      return {
        opprettetAv: vurdering.veilederident,
        tekst: arbeidsuforhetText(vurdering.veilederident, vurdering.type),
        tidspunkt: vurdering.createdAt,
        kilde: "ARBEIDSUFORHET",
      };
    }
  );
}

export function useArbeidsuforhetHistorikk(): HistorikkHook {
  const {
    data: arbeidsuforhetVurderinger,
    isLoading,
    isError,
  } = useGetArbeidsuforhetVurderingerQuery();

  const arbeidsuforhetHistorikk = createHistorikkEventsFromArbeidsuforhet(
    arbeidsuforhetVurderinger
  );

  return {
    isLoading,
    isError,
    events: arbeidsuforhetHistorikk,
  };
}
