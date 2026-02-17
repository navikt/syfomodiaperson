import {
  useDraftQuery,
  useSaveDraft,
  useDeleteDraft,
} from "@/hooks/useDraftQuery";
import { MeldingTilBehandlerDraftDTO } from "@/data/behandlerdialog/meldingtilbehandlerDraftTypes";

const CATEGORY = "behandlerdialog-meldingtilbehandler" as const;

export function useMeldingTilBehandlerDraftQuery() {
  return useDraftQuery<MeldingTilBehandlerDraftDTO>(CATEGORY);
}

export function useSaveMeldingTilBehandlerDraft() {
  return useSaveDraft<MeldingTilBehandlerDraftDTO>(CATEGORY);
}

export function useDeleteMeldingTilBehandlerDraft() {
  return useDeleteDraft(CATEGORY);
}
