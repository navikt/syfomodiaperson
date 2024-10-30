import React, { ReactElement } from "react";
import Side from "../../Side";
import SideLaster from "../../../components/SideLaster";
import Sidetopp from "../../../components/Sidetopp";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Historikk } from "@/sider/historikk/Historikk";
import { Infomelding } from "@/components/Infomelding";
import { useHistorikk } from "@/data/historikk/useHistorikk";

const texts = {
  topp: "Logg",
  pageTitle: "Historikk",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
  ingenHistorikk: {
    tittel: "Denne personen har ingen oppfølgingshistorikk",
    melding:
      "Når en sykmeldt blir fulgt opp vil oppfølgingen bli loggført her slik at du får oversikt over hva som har skjedd og hvem som har vært involvert i oppfølgingen.",
  },
};

export const HistorikkContainer = (): ReactElement => {
  const { historikkEvents, isHistorikkLoading, isHistorikkError } =
    useHistorikk();

  const {
    tilfellerDescendingStart,
    isLoading: isTilfellerLoading,
    isError: isTilfellerError,
  } = useOppfolgingstilfellePersonQuery();

  const tilfeller = tilfellerDescendingStart || [];
  const ingenHistorikk = tilfeller.length === 0 || historikkEvents.length === 0;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.HISTORIKK}>
      <SideLaster
        henter={isHistorikkLoading || isTilfellerLoading}
        hentingFeilet={isHistorikkError || isTilfellerError}
      >
        <Sidetopp tittel={texts.topp} />
        {ingenHistorikk ? (
          <Infomelding
            tittel={texts.ingenHistorikk.tittel}
            melding={texts.ingenHistorikk.melding}
          />
        ) : (
          <Historikk historikkEvents={historikkEvents} tilfeller={tilfeller} />
        )}
      </SideLaster>
    </Side>
  );
};

export default HistorikkContainer;
