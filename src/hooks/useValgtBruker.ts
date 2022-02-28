import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";

export const useValgtPersonident = (): string => {
  const { data } = useAktivBruker();
  return data?.aktivBruker || "";
};
