import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISDIALOGMOTE_ROOT_V2 } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { dialogmoterQueryKeys } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { DialogmoteStatusEndringDTO } from "@/sider/dialogmoter/types/dialogmoteStatusEndringTypes";

export function useDialogmoteStatusEndringHistorikkQuery() {
  const fnr = useValgtPersonident();
  const path = `${ISDIALOGMOTE_ROOT_V2}/dialogmote/personident/motestatusendringer`;
  const fetchDialogmoteStatusEndring = () =>
    get<DialogmoteStatusEndringDTO[]>(path, fnr);
  const query = useQuery({
    queryKey: dialogmoterQueryKeys.statusendringHistorikk(fnr),
    queryFn: fetchDialogmoteStatusEndring,
    enabled: !!fnr,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
