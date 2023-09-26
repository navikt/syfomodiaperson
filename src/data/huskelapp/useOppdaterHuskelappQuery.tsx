import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { HuskelappDto } from "@/data/huskelapp/huskelappTypes";
import { useMutation } from "@tanstack/react-query";

export const queryKeys = {
  huskelapp: (personident: string) => ["huskelapp", personident],
};

export const useOppdatertHuskelappQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const postHuskelapp = (nyHuskelapp: HuskelappDto) =>
    post<HuskelappDto>(path, nyHuskelapp, personident);

  return useMutation({
    mutationFn: postHuskelapp,
  });
};
