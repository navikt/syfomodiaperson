import { FASTLEGEREST_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { Fastlege } from "@/data/fastlege/types/Fastlege";
import { useQuery } from "react-query";
import { useMemo } from "react";

export const fastlegerQueryKeys = {
  fastleger: (fnr: string) => ["fastleger", fnr],
};

export const useFastlegerQuery = (fnr: string) => {
  const path = `${FASTLEGEREST_ROOT}/fastleger?fnr=${fnr}`;
  const fetchFastleger = () => get<Fastlege[]>(path);
  const query = useQuery(fastlegerQueryKeys.fastleger(fnr), fetchFastleger, {
    enabled: !!fnr,
  });
  return {
    ...query,
    ikkeFunnet: query.data && query.data.length === 0,
    tidligereFastleger: useMemo(
      () =>
        query.data?.filter(
          (fastlege) => new Date(fastlege.pasientforhold.tom) < new Date()
        ),
      [query.data]
    ),
    aktivFastlege: useMemo(
      () =>
        query.data?.find(
          (fastlege) =>
            new Date(fastlege.pasientforhold.fom) < new Date() &&
            new Date(fastlege.pasientforhold.tom) > new Date()
        ),
      [query.data]
    ),
  };
};
