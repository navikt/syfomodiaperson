import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";

const OPPRETTET_AV_SYSTEM_DEFAULT = "SYSTEM";

interface SenOppfolgingHistorikk {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

function createHistorikkEvents(
  senOppfolgingKandidater: SenOppfolgingKandidatResponseDTO[]
): HistorikkEvent[] {
  return senOppfolgingKandidater.flatMap((kandidat) => {
    const historikkEvents: HistorikkEvent[] = [];

    if (kandidat.svar) {
      const svarHistorikkEvent: HistorikkEvent = {
        opprettetAv: kandidat.personident,
        tekst: "Svar mottatt fra den sykemeldte",
        tidspunkt: kandidat.createdAt,
        kilde: "SEN_OPPFOLGING",
      };
      historikkEvents.push(svarHistorikkEvent);
    }

    if (kandidat.varselAt) {
      const varselHistorikkEvent: HistorikkEvent = {
        opprettetAv: OPPRETTET_AV_SYSTEM_DEFAULT,
        tekst: "Varsel sendt ut til den sykemeldte",
        tidspunkt: kandidat.createdAt,
        kilde: "SEN_OPPFOLGING",
      };
      historikkEvents.push(varselHistorikkEvent);
    }

    const isFerdigbehandlet =
      kandidat.status === SenOppfolgingStatus.FERDIGBEHANDLET;
    const ferdigbehandletVurdering = kandidat.vurderinger.find(
      (vurdering) =>
        vurdering.type === SenOppfolgingVurderingType.FERDIGBEHANDLET
    );

    if (isFerdigbehandlet && ferdigbehandletVurdering) {
      const ferdigbehandletHistorikkEvent: HistorikkEvent = {
        opprettetAv: ferdigbehandletVurdering.veilederident,
        tekst: `Ferdigbehandlet av: ${ferdigbehandletVurdering.veilederident}`,
        tidspunkt: ferdigbehandletVurdering.createdAt,
        kilde: "SEN_OPPFOLGING",
      };
      historikkEvents.push(ferdigbehandletHistorikkEvent);
    }

    return historikkEvents;
  });
}

export function useSenOppfolgingHistorikk(): SenOppfolgingHistorikk {
  const {
    data: senOppfolgingKandidater,
    isLoading: isSenOppfolgingKandidatLoading,
    isError: isSenOppfolgingKandidatError,
  } = useSenOppfolgingKandidatQuery();

  const historikkEvents = createHistorikkEvents(senOppfolgingKandidater);

  return {
    isLoading: isSenOppfolgingKandidatLoading,
    isError: isSenOppfolgingKandidatError,
    events: historikkEvents,
  };
}
