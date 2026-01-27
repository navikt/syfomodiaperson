import { HistorikkHook } from "@/hooks/historikk/useHistorikk";
import { useKartleggingssporsmalKandidaterQuery } from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import {
  HistorikkEvent,
  HistorikkEventType,
} from "@/data/historikk/types/historikkTypes";
import { KartleggingssporsmalKandidatResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";

function createEventsFromKandidat(
  kandidat: KartleggingssporsmalKandidatResponseDTO,
  person: BrukerinfoDTO
) {
  const events: HistorikkEvent[] = [];
  if (kandidat.varsletAt) {
    events.push({
      tekst: `${person.navn} ble varslet om kartleggingsspørsmål`,
      tidspunkt: new Date(kandidat.varsletAt),
      kilde: "KARTLEGGINGSPORSMAAL" as HistorikkEventType,
    });
  }
  if (kandidat.svarAt) {
    events.push({
      tekst: `${person.navn} svarte på kartleggingsspørsmål`,
      tidspunkt: new Date(kandidat.svarAt),
      kilde: "KARTLEGGINGSPORSMAAL" as HistorikkEventType,
    });
  }
  if (kandidat.vurdering?.vurdertAt) {
    events.push({
      tekst: `Kartleggingsspørsmålene ble vurdert av ${kandidat.vurdering.vurdertBy}`,
      tidspunkt: new Date(kandidat.vurdering.vurdertAt),
      kilde: "KARTLEGGINGSPORSMAAL" as HistorikkEventType,
    });
  }
  events.push({
    tekst: `${person.navn} ble kandidat til kartleggingsspørsmål`,
    tidspunkt: new Date(kandidat.createdAt),
    kilde: "KARTLEGGINGSPORSMAAL" as HistorikkEventType,
  });
  return events;
}

export function useKartleggingssporsmalHistorikk(): HistorikkHook {
  const { data, isLoading, isError } = useKartleggingssporsmalKandidaterQuery();
  const { brukerinfo: person } = useBrukerinfoQuery();

  const kandidater = data || [];
  const events = kandidater
    ?.map((kandidat) => createEventsFromKandidat(kandidat, person))
    .flat()
    .sort((a, b) => b.tidspunkt.getTime() - a.tidspunkt.getTime());

  return {
    isLoading,
    isError,
    events,
  };
}
