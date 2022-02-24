import { QueryClient, useMutation, useQueryClient } from "react-query";
import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  Status,
  StatusEndring,
  StoppAutomatikk,
} from "@/data/pengestopp/types/FlaggPerson";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";

export const useFlaggPerson = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const postFlaggPerson = (stoppAutomatikk: StoppAutomatikk) =>
    post(`${ISPENGESTOPP_ROOT}/person/flagg`, stoppAutomatikk);
  const pengestoppStatusQueryKey = pengestoppStatusQueryKeys.pengestoppStatus(
    fnr
  );

  return useMutation(postFlaggPerson, {
    onMutate: (stoppAutomatikk: StoppAutomatikk) =>
      optimisticUpdateStatusEndring(
        stoppAutomatikk,
        queryClient,
        pengestoppStatusQueryKey
      ),
    onError: (error, variables, context) => {
      if (context?.previousStatusEndring) {
        queryClient.setQueryData(
          pengestoppStatusQueryKey,
          context.previousStatusEndring
        );
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries(pengestoppStatusQueryKey, {
        refetchActive: false,
      }),
  });
};

const optimisticUpdateStatusEndring = (
  stoppAutomatikk: StoppAutomatikk,
  queryClient: QueryClient,
  queryKey: string[]
) => {
  const previousStatusEndring = queryClient.getQueryData<StatusEndring[]>(
    queryKey
  );
  const updatedStatusEndring = stoppAutomatikk2StatusEndring(stoppAutomatikk);
  queryClient.setQueryData(queryKey, [
    ...updatedStatusEndring,
    ...(previousStatusEndring || []),
  ]);

  return { previousStatusEndring };
};

const stoppAutomatikk2StatusEndring = (
  stoppAutomatikk: StoppAutomatikk
): StatusEndring[] => {
  const { virksomhetNr, sykmeldtFnr, arsakList, enhetNr } = stoppAutomatikk;
  return virksomhetNr.map((virksomhet) => {
    return {
      veilederIdent: { value: "" },
      sykmeldtFnr,
      status: Status.STOPP_AUTOMATIKK,
      arsakList,
      virksomhetNr: virksomhet,
      opprettet: new Date().toISOString(),
      enhetNr,
    };
  });
};
