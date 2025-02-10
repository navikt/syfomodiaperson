import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  Status,
  StatusEndring,
  StoppAutomatikk,
} from "@/data/pengestopp/types/FlaggPerson";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";
import { PengestoppFormValues } from "@/components/pengestopp/PengestoppModal";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";

function toStoppAutomatikk(
  fnr: string,
  { arsaker, orgnummer }: PengestoppFormValues,
  valgtEnhet: string
): StoppAutomatikk {
  const orgNummerlist = Array.isArray(orgnummer) ? orgnummer : [orgnummer];
  return {
    sykmeldtFnr: { value: fnr },
    arsakList: arsaker.map((arsak) => ({ type: arsak })),
    virksomhetNr: orgNummerlist.map((orgnummer) => ({
      value: orgnummer,
    })),
    enhetNr: { value: valgtEnhet },
  };
}

export const useFlaggPerson = () => {
  const { valgtEnhet } = useValgtEnhet();
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const postFlaggPerson = (values: PengestoppFormValues) => {
    const stoppAutomatikk = toStoppAutomatikk(fnr, values, valgtEnhet);
    return post(`${ISPENGESTOPP_ROOT}/person/flagg`, stoppAutomatikk);
  };
  const pengestoppStatusQueryKey =
    pengestoppStatusQueryKeys.pengestoppStatus(fnr);

  return useMutation({
    mutationFn: postFlaggPerson,
    onSuccess: (_, values) => {
      const previousStatusEndring =
        queryClient.getQueryData<StatusEndring[]>(pengestoppStatusQueryKey) ||
        [];
      const updatedStatusEndring = stoppAutomatikk2StatusEndring(
        toStoppAutomatikk(fnr, values, valgtEnhet)
      );
      queryClient.setQueryData(pengestoppStatusQueryKey, [
        ...updatedStatusEndring,
        ...previousStatusEndring,
      ]);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: pengestoppStatusQueryKey,
        refetchType: "none",
      }),
  });
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
