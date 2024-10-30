import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useDialogmotekandidatHistorikkQuery } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import {
  DialogmotekandidatHistorikkDTO,
  HistorikkType,
} from "@/data/dialogmotekandidat/dialogmotekandidatTypes";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

function getDialogmotekandidatHistorikkText(
  { type, vurdertAv }: DialogmotekandidatHistorikkDTO,
  person: BrukerinfoDTO
) {
  switch (type) {
    case HistorikkType.KANDIDAT:
      return `${person.navn} ble kandidat til dialogmøte`;
    case HistorikkType.UNNTAK:
      return `${vurdertAv} vurderte unntak fra dialogmøte`;
    case HistorikkType.IKKE_AKTUELL:
      return `${vurdertAv} vurderte dialogmøte ikke aktuelt`;
    case HistorikkType.LUKKET:
      return `Kandidat til dialogmøte ble maskinelt lukket`;
  }
}

function createHistorikkEventsFromDialogmotekandidatHistorikk(
  dialogmotekandidatHistorikk: DialogmotekandidatHistorikkDTO[],
  person: BrukerinfoDTO
): HistorikkEvent[] {
  return dialogmotekandidatHistorikk.map((value) => ({
    opprettetAv: value.vurdertAv ?? undefined,
    tekst: getDialogmotekandidatHistorikkText(value, person),
    tidspunkt: value.tidspunkt,
    kilde: "DIALOGMOTEKANDIDAT",
  }));
}

interface DialogmotekandidatHistorikk {
  isDialogmotekandidatHistorikkLoading: boolean;
  isDialogmotekandidatHistorikkError: boolean;
  dialogmotekandidatHistorikk: HistorikkEvent[];
}

export function useDialogmotekandidatHistorikk(): DialogmotekandidatHistorikk {
  const { brukerinfo: person } = useBrukerinfoQuery();
  const {
    data: dialogmotekandidatHistorikk,
    isLoading: isDialogmotekandidatHistorikkLoading,
    isError: isDialogmotekandidatHistorikkError,
  } = useDialogmotekandidatHistorikkQuery();

  const dialogmotekandidatHistorikkEvents =
    createHistorikkEventsFromDialogmotekandidatHistorikk(
      dialogmotekandidatHistorikk || [],
      person
    );

  return {
    isDialogmotekandidatHistorikkLoading,
    isDialogmotekandidatHistorikkError,
    dialogmotekandidatHistorikk: dialogmotekandidatHistorikkEvents,
  };
}
