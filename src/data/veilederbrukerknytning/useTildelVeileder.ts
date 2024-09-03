import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { veilederBrukerKnytningQueryKeys } from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";

export const useTildelVeileder = () => {
  const personident = useValgtPersonident();
  const { valgtEnhet } = useValgtEnhet();
  const queryClient = useQueryClient();

  const path = `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/registrer`;
  const postTildelVeileder = (veilederIdent: string) => {
    const veilederBrukerKnytning: VeilederBrukerKnytning = {
      veilederIdent: veilederIdent,
      fnr: personident,
      enhet: valgtEnhet,
    };

    return post(path, {
      tilknytninger: [veilederBrukerKnytning],
    });
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
  enhet: string;
}
