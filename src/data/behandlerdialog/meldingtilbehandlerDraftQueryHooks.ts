import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get, put, deleteRequest } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MeldingTilBehandlerDraftDTO } from "@/data/behandlerdialog/meldingtilbehandlerDraftTypes";

const draftPath = "/api/behandlerdialog/meldingtilbehandler/draft";

export const meldingtilbehandlerDraftQueryKeys = {
  draft: (personident: string) => ["meldingtilbehandlerDraft", personident],
};

export function useMeldingTilBehandlerDraftQuery() {
  const personident = useValgtPersonident();

  const fetchDraft = async () =>
    get<MeldingTilBehandlerDraftDTO>(draftPath, personident);

  return useQuery({
    queryKey: meldingtilbehandlerDraftQueryKeys.draft(personident),
    queryFn: fetchDraft,
    enabled: !!personident,
    retry: false,
  });
}

export function useSaveMeldingTilBehandlerDraft() {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const saveDraft = async (draft: MeldingTilBehandlerDraftDTO) =>
    await put<void>(draftPath, draft, personident);

  return useMutation({
    mutationFn: saveDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: meldingtilbehandlerDraftQueryKeys.draft(personident),
      });
    },
  });
}

export function useDeleteMeldingTilBehandlerDraft() {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const deleteDraft = async () =>
    await deleteRequest<void>(draftPath, personident);

  return useMutation({
    mutationFn: deleteDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: meldingtilbehandlerDraftQueryKeys.draft(personident),
      });
    },
  });
}
