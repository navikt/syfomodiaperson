import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "react-query";

const diskresjonskodeQueryKeys = {
  diskresjonskode: (fnr: string) => ["diskresjonskode", fnr],
};

export const useDiskresjonskodeQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/diskresjonskode`;
  const fetchDiskresjonskode = () => get<number>(path, fnr);
  return useQuery(
    diskresjonskodeQueryKeys.diskresjonskode(fnr),
    fetchDiskresjonskode,
    { enabled: !!fnr, select: (diskresjonskode) => diskresjonskode.toString() }
  );
};
