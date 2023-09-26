import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { HuskelappDto } from "@/data/huskelapp/huskelappTypes";

export const queryKeys = {
  huskelapp: (personident: string) => ["huskelapp", personident],
};

export const useGetHuskelappQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const getHuskelapp = () => get<HuskelappDto>(path, personident);

  const { data: huskelapp } = useQuery({
    queryKey: queryKeys.huskelapp(personident),
    queryFn: getHuskelapp,
    enabled: !!personident,
  });

  return {
    huskelapp,
  };
};
