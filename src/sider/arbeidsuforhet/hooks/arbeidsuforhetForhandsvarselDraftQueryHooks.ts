import {
  useDraftQuery,
  useSaveDraft,
  useDeleteDraft,
} from "@/hooks/useDraftQuery";
import { ArbeidsuforhetForhandsvarselDraftDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetForhandsvarselDraftTypes";

const CATEGORY = "arbeidsuforhet-forhandsvarsel" as const;

export function useArbeidsuforhetForhandsvarselDraftQuery() {
  return useDraftQuery<ArbeidsuforhetForhandsvarselDraftDTO>(CATEGORY);
}

export function useSaveArbeidsuforhetForhandsvarselDraft() {
  return useSaveDraft<ArbeidsuforhetForhandsvarselDraftDTO>(CATEGORY);
}

export function useDeleteArbeidsuforhetForhandsvarselDraft() {
  return useDeleteDraft(CATEGORY);
}
