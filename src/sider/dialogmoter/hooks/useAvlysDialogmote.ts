import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { AvlysDialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";

export const useAvlysDialogmote = (fnr: string, dialogmoteUuid: string) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/avlys`;
  const postAvlysDialogmote = (avlysning: AvlysDialogmoteDTO) =>
    post(path, avlysning);

  return useMutation({
    mutationFn: postAvlysDialogmote,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
      }),
  });
};
