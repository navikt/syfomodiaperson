import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import {
  VurderingResponseDTO as ManglendemedvirkningVurdering,
  VurderingType as ManglendemedvirkningVurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";

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

interface ManglendeMedvirkningHistorikk {
  isManglendeMedvirkningHistorikkLoading: boolean;
  isManglendeMedvirkningHistorikkError: boolean;
  manglendeMedvirkningHistorikk: HistorikkEvent[];
}

export function useManglendeMedvirkningHistorikk(): ManglendeMedvirkningHistorikk {
  const {
    data: manglendemedvirkningVurderinger,
    isLoading: isManglendemedvirkningLoading,
    isError: isManglendemedvirkningError,
  } = useManglendemedvirkningVurderingQuery();

  const manglendeMedvirkningHistorikk =
    createHistorikkEventsFromManglendemedvirkning(
      manglendemedvirkningVurderinger
    );

  return {
    isManglendeMedvirkningHistorikkLoading: isManglendemedvirkningLoading,
    isManglendeMedvirkningHistorikkError: isManglendemedvirkningError,
    manglendeMedvirkningHistorikk,
  };
}
