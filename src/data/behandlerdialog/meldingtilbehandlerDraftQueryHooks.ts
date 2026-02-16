import {
  useDraftQuery,
  useSaveDraft,
  useDeleteDraft,
} from "@/hooks/useDraftQuery";
import { MeldingTilBehandlerDraftDTO } from "@/data/behandlerdialog/meldingtilbehandlerDraftTypes";

const CATEGORY = "behandlerdialog-meldingtilbehandler" as const;

export const meldingtilbehandlerDraftQueryKeys = {
  draft: (personident: string) => ["draft", CATEGORY, personident],
};

export function useMeldingTilBehandlerDraftQuery() {
  return useDraftQuery<MeldingTilBehandlerDraftDTO>(CATEGORY);
}

export function useSaveMeldingTilBehandlerDraft() {
  return useSaveDraft<MeldingTilBehandlerDraftDTO>(CATEGORY);
}

export function useDeleteMeldingTilBehandlerDraft() {
  return useDeleteDraft(CATEGORY);
}
