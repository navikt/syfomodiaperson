import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks";

export function useValgtPersonident(): string {
  const { data } = useAktivBruker();
  return data?.aktivBruker || "";
}
