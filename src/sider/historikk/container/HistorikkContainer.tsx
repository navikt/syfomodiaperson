import React, { ReactElement } from "react";
import Side from "../../../components/side/Side";
import SideLaster from "../../../components/side/SideLaster";
import Sidetopp from "../../../components/side/Sidetopp";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Historikk from "@/sider/historikk/Historikk";
import { Infomelding } from "@/components/Infomelding";
import { useHistorikk } from "@/hooks/historikk/useHistorikk";

const texts = {
  topp: "Historikk",
  pageTitle: "Historikk",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
  ingenHistorikk: {
    tittel: "Denne personen har ingen oppfølgingshistorikk",
    melding:
      "Når en sykmeldt blir fulgt opp vil oppfølgingen bli loggført her slik at du får oversikt over hva som har skjedd og hvem som har vært involvert i oppfølgingen.",
  },
};

export default function HistorikkContainer(): ReactElement {
  const { events, isLoading, isError } = useHistorikk();
  const {
    tilfellerDescendingStart,
    isLoading: isTilfellerLoading,
    isError: isTilfellerError,
  } = useOppfolgingstilfellePersonQuery();
  const tilfeller = tilfellerDescendingStart || [];
  const ingenHistorikk = tilfeller.length === 0 || events.length === 0;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.HISTORIKK}>
      <SideLaster
        isLoading={isLoading || isTilfellerLoading}
        isError={isError || isTilfellerError}
        className="flex flex-col"
      >
        <Sidetopp tittel={texts.topp} />
        {ingenHistorikk ? (
          <Infomelding
            tittel={texts.ingenHistorikk.tittel}
            melding={texts.ingenHistorikk.melding}
          />
        ) : (
          <Historikk historikkEvents={events} tilfeller={tilfeller} />
        )}
      </SideLaster>
    </Side>
  );
}
