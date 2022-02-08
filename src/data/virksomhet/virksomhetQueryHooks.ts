import { SYFOMOTEADMIN_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { Virksomhet } from "@/data/virksomhet/types/Virksomhet";
import { useQuery } from "react-query";
import { minutesToMillis } from "@/utils/timeUtils";

const virksomhetQueryKeys = {
  virksomhet: (orgnummer: string | undefined) => ["virksomhet", orgnummer],
};

export const useVirksomhetQuery = (orgnummer: string | undefined) => {
  const path = `${SYFOMOTEADMIN_ROOT}/virksomhet/${orgnummer}`;
  const fetchVirksomhet = () => get<Virksomhet>(path);
  return useQuery(virksomhetQueryKeys.virksomhet(orgnummer), fetchVirksomhet, {
    enabled: !!orgnummer,
    staleTime: minutesToMillis(60 * 12),
  });
};
