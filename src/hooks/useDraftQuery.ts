import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get, put, deleteRequest } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type DraftCategory =
  | "behandlerdialog-meldingtilbehandler"
  | "arbeidsuforhet-forhandsvarsel";

function draftPath(category: DraftCategory): string {
  return `/api/draft/${category}`;
}

export const draftQueryKeys = {
  draft: (category: DraftCategory, personident: string) => [
    "draft",
    category,
    personident,
  ],
};

export function useDraftQuery<T>(category: DraftCategory) {
  const personident = useValgtPersonident();

  const fetchDraft = async () => get<T>(draftPath(category), personident);

  return useQuery({
    queryKey: draftQueryKeys.draft(category, personident),
    queryFn: fetchDraft,
    enabled: !!personident,
    retry: false,
  });
}

export function useSaveDraft<T extends object>(category: DraftCategory) {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const saveDraft = async (draft: T) =>
    await put<void>(draftPath(category), draft, personident);

  return useMutation({
    mutationFn: saveDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: draftQueryKeys.draft(category, personident),
      });
    },
  });
}

export function useDeleteDraft(category: DraftCategory) {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const deleteDraft = async () =>
    await deleteRequest<void>(draftPath(category), personident);

  return useMutation({
    mutationFn: deleteDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: draftQueryKeys.draft(category, personident),
      });
    },
  });
}
