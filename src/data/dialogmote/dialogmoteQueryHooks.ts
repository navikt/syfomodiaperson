import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useQuery } from "react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMemo } from "react";

export const dialogmoterQueryKeys = {
  dialogmoter: (fnr: string) => ["dialogmoter", fnr],
};

export const useDialogmoterQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/personident`;
  const fetchDialogmoter = () => get<DialogmoteDTO[]>(path, fnr);
  const query = useQuery(
    dialogmoterQueryKeys.dialogmoter(fnr),
    fetchDialogmoter,
    {
      enabled: !!fnr,
    }
  );

  return {
    ...query,
    data: query.data || [],
    aktivtDialogmote: useMemo(
      () =>
        query.data?.find(
          (mote) =>
            mote.status === DialogmoteStatus.NYTT_TID_STED ||
            mote.status === DialogmoteStatus.INNKALT
        ),
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
