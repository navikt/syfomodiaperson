import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import { useQuery } from "react-query";

export const veilederinfoQueryKeys = {
  veilederinfo: ["veilederinfo"],
};

export const useVeilederinfoQuery = () => {
  const path = `${SYFOVEILEDER_ROOT}/veileder/self`;
  const fetchVeilederinfo = () => get<VeilederinfoDTO>(path);
  return useQuery(veilederinfoQueryKeys.veilederinfo, fetchVeilederinfo);
};
