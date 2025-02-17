import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import {
  VurderingResponseDTO as ManglendemedvirkningVurdering,
  VurderingType as ManglendemedvirkningVurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function manglendemedvirkningText(
  veilederident: string,
  vurderingType: ManglendemedvirkningVurderingType
): string {
  switch (vurderingType) {
    case ManglendemedvirkningVurderingType.FORHANDSVARSEL:
      return veilederident + " sendte forhåndsvarsel";
    case ManglendemedvirkningVurderingType.OPPFYLT:
      return veilederident + " vurderte oppfylt";
    case ManglendemedvirkningVurderingType.STANS:
      return veilederident + " vurderte stans";
    case ManglendemedvirkningVurderingType.UNNTAK:
      return veilederident + " vurderte unntak";
    case ManglendemedvirkningVurderingType.IKKE_AKTUELL:
      return veilederident + " vurderte ikke aktuell";
  }
}

function createHistorikkEventsFromManglendemedvirkning(
  manglendemedvirkningVurderinger: ManglendemedvirkningVurdering[]
): HistorikkEvent[] {
  return manglendemedvirkningVurderinger.map(
    (vurdering: ManglendemedvirkningVurdering) => {
      return {
        opprettetAv: vurdering.veilederident,
        tekst: manglendemedvirkningText(
          vurdering.veilederident,
          vurdering.vurderingType
        ),
        tidspunkt: vurdering.createdAt,
        kilde: "MANGLENDE_MEDVIRKNING",
      };
    }
  );
}

export function useManglendeMedvirkningHistorikk(): HistorikkHook {
  const { data, isLoading, isError } = useManglendemedvirkningVurderingQuery();
  const manglendeMedvirkningHistorikk =
    createHistorikkEventsFromManglendemedvirkning(data);

  return {
    isLoading,
    isError,
    events: manglendeMedvirkningHistorikk,
  };
}
