import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { DialogmoteInnkallingDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";

export const useOpprettInnkallingDialogmote = (fnr: string) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/personident`;
  const postOpprettInnkalling = (innkalling: DialogmoteInnkallingDTO) =>
    post(path, innkalling, fnr);

  return useMutation({
    mutationFn: postOpprettInnkalling,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
      }),
  });
};
