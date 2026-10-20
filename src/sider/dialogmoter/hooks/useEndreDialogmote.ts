import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { EndreDialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";

export const useEndreDialogmote = (fnr: string, dialogmoteUuid: string) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/`;
  const postEndre = (endring: EndreDialogmoteDTO) => post(path, endring);

  return useMutation({
    mutationFn: postEndre,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
      }),
  });
};
