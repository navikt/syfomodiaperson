import { useAppSelector } from "@/hooks/hooks";
import { HistorikkEvent } from "./types/historikkTypes";
import {
  useHistorikkMotebehovQuery,
  useHistorikkOppfolgingsplan,
} from "@/data/historikk/historikkQueryHooks";

export const useHistorikk: () => {
  hentingHistorikkFeilet: boolean;
  skalHenteMoter: boolean;
  moteHistorikk: HistorikkEvent[];
  oppfolgingsplanHistorikk: HistorikkEvent[];
  motebehovHistorikk: HistorikkEvent[];
  henterHistorikk: boolean;
} = () => {
  const motebehovHistorikkQuery = useHistorikkMotebehovQuery();
  const oppfolgingsplanHistorikkQuery = useHistorikkOppfolgingsplan();
  const { henterMoter, hentetMoter, hentingMoterFeilet, moteHistorikk } =
    useAppSelector((state) => state.historikk);

  const henterHistorikk =
    oppfolgingsplanHistorikkQuery.isLoading ||
    motebehovHistorikkQuery.isLoading ||
    henterMoter;
  const skalHenteMoter = !(henterMoter || hentetMoter || hentingMoterFeilet);

  return {
    henterHistorikk,
    skalHenteMoter,
    hentingHistorikkFeilet:
      hentingMoterFeilet ||
      motebehovHistorikkQuery.isError ||
      oppfolgingsplanHistorikkQuery.isError,
    moteHistorikk,
    motebehovHistorikk: motebehovHistorikkQuery.data,
    oppfolgingsplanHistorikk: oppfolgingsplanHistorikkQuery.data,
  };
};
