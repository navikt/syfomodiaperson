import React, { ReactElement } from "react";
import Side from "../../Side";
import SideLaster from "../../../components/SideLaster";
import Sidetopp from "../../../components/Sidetopp";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Historikk } from "@/sider/historikk/Historikk";
import { Infomelding } from "@/components/Infomelding";
import { useHistorikk } from "@/hooks/historikk/useHistorikk";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import HistorikkFlexjar from "@/sider/historikk/flexjar/HistorikkFlexjar";

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
  const { historikkEvents, isHistorikkLoading, isHistorikkError } =
    useHistorikk();
  const {
    tilfellerDescendingStart,
    isLoading: isTilfellerLoading,
    isError: isTilfellerError,
  } = useOppfolgingstilfellePersonQuery();
  const { toggles } = useFeatureToggles();

  const { storedValue: flexjarFeedbackDate } = useLocalStorageState<Date>(
    StoreKey.FLEXJAR_HISTORIKK_DATE
  );
  const hasGivenFeedback = !!flexjarFeedbackDate;
  const { data: diskresjonskode } = useDiskresjonskodeQuery();
  const showFlexjar =
    toggles.isHistorikkFlexjarEnabled &&
    !hasGivenFeedback &&
    diskresjonskode !== "6" &&
    diskresjonskode !== "7";

  const tilfeller = tilfellerDescendingStart || [];
  const ingenHistorikk = tilfeller.length === 0 || historikkEvents.length === 0;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.HISTORIKK}>
      <SideLaster
        henter={isHistorikkLoading || isTilfellerLoading}
        hentingFeilet={isHistorikkError || isTilfellerError}
        className="flex flex-col"
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
        {showFlexjar && !ingenHistorikk && <HistorikkFlexjar />}
      </SideLaster>
    </Side>
  );
}
