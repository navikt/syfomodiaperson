import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { RSContext } from "@/data/modiacontext/modiacontextTypes";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const modiacontextQueryKeys = {
  aktivbruker: ["aktivbruker"],
};

export const useAktivBruker = () => {
  const path = `${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`;
  const fetchAktivBruker = () => get<RSContext>(path);
  return useQuery({
    queryKey: modiacontextQueryKeys.aktivbruker,
    queryFn: fetchAktivBruker,
    staleTime: minutesToMillis(60 * 12),
  });
};
