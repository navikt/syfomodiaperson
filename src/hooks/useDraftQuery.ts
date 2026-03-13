import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get, put, deleteRequest } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type DraftCategory =
  | "behandlerdialog-meldingtilbehandler"
  | "arbeidsuforhet-forhandsvarsel"
  | "arbeidsuforhet-avslag-uten-forhandsvarsel"
  | "arbeidsuforhet-oppfylt"
  | "manglendemedvirkning-forhandsvarsel"
  | "aktivitetskrav-forhandsvarsel"
  | "aktivitetskrav-unntak"
  | "aktivitetskrav-oppfylt"
  | "aktivitetskrav-innstilling-om-stans";

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

export interface DraftTextDTO {
  begrunnelse: string;
}

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
    await put<T>(draftPath(category), draft, personident);

  return useMutation({
    mutationFn: saveDraft,
    onSuccess: async (data: T) => {
      await queryClient.setQueryData(
        draftQueryKeys.draft(category, personident),
        data
      );
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
