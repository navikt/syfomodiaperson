import {
  useDraftQuery,
  useSaveDraft,
  useDeleteDraft,
} from "@/hooks/useDraftQuery";
import { MeldingType } from "./behandlerdialogTypes";

export interface MeldingTilBehandlerDraftDTO {
  tekst: string;
  meldingType?: MeldingType;
  behandlerRef?: string;
}

const CATEGORY = "behandlerdialog-meldingtilbehandler";

export function useMeldingTilBehandlerDraftQuery() {
  return useDraftQuery<MeldingTilBehandlerDraftDTO>(CATEGORY);
}

export function useSaveMeldingTilBehandlerDraft() {
  return useSaveDraft<MeldingTilBehandlerDraftDTO>(CATEGORY);
}

export function useDeleteMeldingTilBehandlerDraft() {
  return useDeleteDraft(CATEGORY);
}
