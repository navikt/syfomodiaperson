import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useQuery } from "react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const dialogmoterQueryKeys = {
  dialogmoter: (fnr: string) => ["dialogmoter", fnr],
};

export const useDialogmoterQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/personident`;
  const fetchDialogmoter = () => get<DialogmoteDTO[]>(path, fnr);
  return useQuery(dialogmoterQueryKeys.dialogmoter(fnr), fetchDialogmoter, {
    enabled: !!fnr,
  });
};
