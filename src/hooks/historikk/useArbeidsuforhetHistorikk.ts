import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO as ArbeidsuforhetVurderinger,
  VurderingType as ArbeidsuforhetVurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

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

interface ArbeidsuforhetHistorikk {
  isArbeidsuforhetHistorikkLoading: boolean;
  isArbeidsuforhetHistorikkError: boolean;
  arbeidsuforhetHistorikk: HistorikkEvent[];
}

export function useArbeidsuforhetHistorikk(): ArbeidsuforhetHistorikk {
  const {
    data: arbeidsuforhetVurderinger,
    isLoading: isArbeidsuforhetLoading,
    isError: isArbeidsuforhetError,
  } = useGetArbeidsuforhetVurderingerQuery();

  const arbeidsuforhetHistorikk = createHistorikkEventsFromArbeidsuforhet(
    arbeidsuforhetVurderinger
  );

  return {
    isArbeidsuforhetHistorikkLoading: isArbeidsuforhetLoading,
    isArbeidsuforhetHistorikkError: isArbeidsuforhetError,
    arbeidsuforhetHistorikk,
  };
}
