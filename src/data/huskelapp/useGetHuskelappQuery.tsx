import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { HuskelappDTO } from "@/data/huskelapp/huskelappTypes";

export const useGetHuskelappQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const getHuskelapp = () => get<HuskelappDTO>(path, personident);

  const {
    data: huskelapp,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryFn: getHuskelapp,
    enabled: !!personident,
  });

  return {
    huskelapp,
    isSuccess,
    isLoading,
    isError,
  };
};
