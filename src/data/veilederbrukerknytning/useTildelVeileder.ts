import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { veilederBrukerKnytningQueryKeys } from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";

export const useTildelVeileder = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();

  const path = `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`;
  const postTildelVeileder = (veilederIdent: string) => {
    const veilederBrukerKnytning: VeilederBrukerKnytning = {
      veilederIdent: veilederIdent,
      fnr: personident,
    };

    return post(path, veilederBrukerKnytning);
  };

  return useMutation({
    mutationFn: postTildelVeileder,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey:
          veilederBrukerKnytningQueryKeys.veilederBrukerKnytning(personident),
      });
    },
  });
};

interface VeilederBrukerKnytning {
  veilederIdent: string;
  fnr: string;
}
