import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useAktivitetskravHistorikkQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  AktivitetskravHistorikkDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function getTextForHistorikk(
  historikk: AktivitetskravHistorikkDTO,
  person: BrukerinfoDTO
): string {
  switch (historikk.status) {
    case AktivitetskravStatus.NY:
      return `${person.navn} ble kandidat til aktivitetskravet`;
    case AktivitetskravStatus.NY_VURDERING:
      return `Det ble startet ny vurdering av aktivitetskravet`;
    case AktivitetskravStatus.UNNTAK:
      return `${historikk.vurdertAv} vurderte unntak fra aktivitetskravet`;
    case AktivitetskravStatus.OPPFYLT:
      return `${historikk.vurdertAv} vurderte at aktivitetskravet var oppfylt`;
    case AktivitetskravStatus.STANS:
    case AktivitetskravStatus.IKKE_OPPFYLT:
      return `${historikk.vurdertAv} vurderte at aktivitetskravet ikke var oppfylt`;
    case AktivitetskravStatus.IKKE_AKTUELL:
      return `${historikk.vurdertAv} vurderte at aktivitetskravet ikke var aktuelt`;
    case AktivitetskravStatus.FORHANDSVARSEL:
      return `Det ble sendt et forhåndsvarsel for aktivitetskravet av ${historikk.vurdertAv}`;
    case AktivitetskravStatus.LUKKET:
      return `Vurderingen av aktivitetskravet ble lukket av systemet`;
    case AktivitetskravStatus.AVVENT:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
      throw new Error("Not supported");
  }
}

function createHistorikkEventsFromAktivitetskrav(
  aktivitietskravHistorikkDTO: AktivitetskravHistorikkDTO[],
  person: BrukerinfoDTO
): HistorikkEvent[] {
  return aktivitietskravHistorikkDTO
    .filter(
      (entry) =>
        entry.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT &&
        entry.status !== AktivitetskravStatus.AVVENT
    )
    .map((entry: AktivitetskravHistorikkDTO) => {
      return {
        opprettetAv: entry.vurdertAv ?? undefined,
        tekst: getTextForHistorikk(entry, person),
        tidspunkt: entry.tidspunkt,
        kilde: "AKTIVITETSKRAV",
      };
    });
}

export function useAktivitetskravHistorikk(): HistorikkHook {
  const { brukerinfo: person } = useBrukerinfoQuery();
  const {
    data: aktivitetskravHistorikk,
    isLoading,
    isError,
  } = useAktivitetskravHistorikkQuery();

  const events = createHistorikkEventsFromAktivitetskrav(
    aktivitetskravHistorikk || [],
    person
  );

  return {
    isLoading,
    isError,
    events,
  };
}
