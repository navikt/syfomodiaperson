import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { EndreTidStedDialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";

export const useEndreTidStedDialogmote = (
  fnr: string,
  dialogmoteUuid: string
) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/tidsted`;
  const postEndreTidSted = (endring: EndreTidStedDialogmoteDTO) =>
    post(path, endring);

  return useMutation({
    mutationFn: postEndreTidSted,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
      }),
  });
};
