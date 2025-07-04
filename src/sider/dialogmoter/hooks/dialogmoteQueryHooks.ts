import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useQuery } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMemo } from "react";
import { isAktivtDialogmote } from "@/utils/dialogmoteUtils";

export const dialogmoterQueryKeys = {
  dialogmoter: (fnr: string) => ["dialogmoter", fnr],
  statusendringHistorikk: (fnr: string) => [
    "dialogmoter",
    fnr,
    "statusendringHistorikk",
  ],
};

export const useDialogmoterQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/personident`;
  const fetchDialogmoter = () => get<DialogmoteDTO[]>(path, fnr);
  const query = useQuery({
    queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
    queryFn: fetchDialogmoter,
    enabled: !!fnr,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    aktivtDialogmote: useMemo(
      () => query.data?.find((mote) => isAktivtDialogmote(mote)),
      [query.data]
    ),
    ferdigstilteDialogmoter: useMemo(
      () =>
        query.data?.filter(
          (mote) => mote.status === DialogmoteStatus.FERDIGSTILT
        ) || [],
      [query.data]
    ),
    historiskeDialogmoter: useMemo(
      () =>
        query.data?.filter(
          (mote) =>
            mote.status === DialogmoteStatus.FERDIGSTILT ||
            mote.status === DialogmoteStatus.AVLYST
        ) || [],
      [query.data]
    ),
  };
};
