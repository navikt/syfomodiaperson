import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { post } from "@/api/axios";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";

export const useBehandleMotebehov = () => {
  const fnr = useValgtPersonident();
  const { data: veilederinfo } = useVeilederinfoQuery();
  const veilederIdent = veilederinfo?.ident;
  const queryClient = useQueryClient();
  const path = `${SYFOMOTEBEHOV_ROOT}/motebehov/${fnr}/behandle`;
  const postBehandleMotebehov = () => post(path, {});
  const motebehovQueryKey = motebehovQueryKeys.motebehov(fnr);

  return useMutation(postBehandleMotebehov, {
    onMutate: () =>
      optimisticUpdateMotebehovBehandlet(
        queryClient,
        motebehovQueryKey,
        veilederIdent
      ),
    onError: (error, variables, context) => {
      if (context?.previousMotebehov) {
        queryClient.setQueryData(motebehovQueryKey, context.previousMotebehov);
      }
    },
    onSettled: () => queryClient.invalidateQueries(motebehovQueryKey),
  });
};

const optimisticUpdateMotebehovBehandlet = (
  queryClient: QueryClient,
  queryKey: string[],
  veilederIdent: string | undefined
) => {
  const previousMotebehov = queryClient.getQueryData<MotebehovVeilederDTO[]>(
    queryKey
  );
  if (previousMotebehov && veilederIdent) {
    queryClient.setQueryData(
      queryKey,
      previousMotebehov.map((motebehov) => ({
        ...motebehov,
        behandletTidspunkt: new Date(),
        behandletVeilederIdent: veilederIdent,
      }))
    );
  }

  return { previousMotebehov };
};
