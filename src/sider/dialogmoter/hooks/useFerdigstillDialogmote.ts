import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { NewDialogmoteReferatDTO } from "@/sider/dialogmoter/types/dialogmoteReferatTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useFerdigstillDialogmote = (dialogmoteUuid: string) => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/ferdigstill`;
  const postFerdigstillDialogmote = (referat: NewDialogmoteReferatDTO) =>
    post(path, referat);

  return useMutation({
    mutationFn: postFerdigstillDialogmote,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
      }),
  });
};
