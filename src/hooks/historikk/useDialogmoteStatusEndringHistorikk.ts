import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useDialogmoteStatusEndringHistorikkQuery } from "@/sider/dialogmoter/hooks/dialogmoteStatusEndringHistorikkQuery";
import { DialogmoteStatusEndringDTO } from "@/sider/dialogmoter/types/dialogmoteStatusEndringTypes";
import { DialogmoteStatus } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function getDialogmoteStatusEndringText(
  statusendring: DialogmoteStatusEndringDTO
): string {
  switch (statusendring.status) {
    case DialogmoteStatus.INNKALT:
      return `${statusendring.statusEndringOpprettetAv} kalte inn til et dialogmøte`;
    case DialogmoteStatus.NYTT_TID_STED:
      return `${statusendring.statusEndringOpprettetAv} endret tid eller sted for dialogmøtet opprettet av ${statusendring.dialogmoteOpprettetAv}`;
    case DialogmoteStatus.AVLYST:
      return `${statusendring.statusEndringOpprettetAv} avlyste dialogmøtet opprettet av ${statusendring.dialogmoteOpprettetAv}`;
    case DialogmoteStatus.FERDIGSTILT:
      return `${statusendring.statusEndringOpprettetAv} skrev referat fra dialogmøtet opprettet av ${statusendring.dialogmoteOpprettetAv}`;
    case DialogmoteStatus.LUKKET:
      return `Dialogmøtet innkalt av ${statusendring.dialogmoteOpprettetAv} ble lukket av systemet`;
  }
}

function createHistorikkEvents(
  statusendringer: DialogmoteStatusEndringDTO[]
): HistorikkEvent[] {
  return statusendringer.map((statusendring) => {
    return {
      opprettetAv: statusendring.statusEndringOpprettetAv,
      tekst: getDialogmoteStatusEndringText(statusendring),
      tidspunkt: statusendring.createdAt,
      kilde: "MOTER",
    };
  });
}

export function useDialogmoteStatusEndringHistorikk(): HistorikkHook {
  const {
    data: statusendringer,
    isLoading,
    isError,
  } = useDialogmoteStatusEndringHistorikkQuery();

  const historikkEvents = createHistorikkEvents(statusendringer);

  return {
    isLoading,
    isError,
    events: historikkEvents,
  };
}
