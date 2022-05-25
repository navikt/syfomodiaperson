import React, { ReactElement, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import Side from "../../../sider/Side";
import Historikk from "../Historikk";
import { HISTORIKK } from "@/enums/menypunkter";
import SideLaster from "../../SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { hentHistorikkMoter } from "@/data/historikk/historikk_actions";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import IngenHistorikk from "../IngenHistorikk";
import { useHistorikk } from "@/data/historikk/historikk_hooks";
import Sidetopp from "../../Sidetopp";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

const texts = {
  topp: "Logg",
  pageTitle: "Historikk",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

const createHistorikkEventsFromLedere = (
  ledere: NarmesteLederRelasjonDTO[]
): HistorikkEvent[] => {
  return ledere.map((leder) => ({
    opprettetAv: leder.virksomhetsnavn,
    tekst: `${leder.virksomhetsnavn} har oppgitt ${leder.narmesteLederNavn} som nærmeste leder`,
    tidspunkt: leder.aktivFom,
    kilde: "LEDER",
  }));
};

export const HistorikkContainer = (): ReactElement => {
  const fnr = useValgtPersonident();
  const dispatch = useDispatch();
  const {
    henterHistorikk,
    hentingHistorikkFeilet,
    skalHenteMoter,
    moteHistorikk,
    motebehovHistorikk,
    oppfolgingsplanHistorikk,
  } = useHistorikk();

  const {
    isLoading: henterLedere,
    isError: hentingLedereFeilet,
    currentLedere,
    formerLedere,
  } = useLedereQuery();

  const {
    data: oppfolgingstilfellePerson,
    isLoading: henterTilfeller,
    isError: hentingTilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  const henter = henterLedere || henterHistorikk || henterTilfeller;
  const hentingFeilet =
    hentingLedereFeilet || hentingHistorikkFeilet || hentingTilfellerFeilet;

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );

  useEffect(() => {
    if (skalHenteMoter) {
      dispatch(hentHistorikkMoter(fnr));
    }
  }, [dispatch, fnr, skalHenteMoter]);

  const tilfeller = oppfolgingstilfellePerson?.oppfolgingstilfelleList || [];
  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);
  const historikkEvents = motebehovHistorikk
    .concat(moteHistorikk)
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk);
  const ingenHistorikk = tilfeller.length === 0 || historikkEvents.length === 0;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={HISTORIKK}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.topp} />
        {ingenHistorikk ? (
          <IngenHistorikk />
        ) : (
          <Historikk historikkEvents={historikkEvents} tilfeller={tilfeller} />
        )}
      </SideLaster>
    </Side>
  );
};

export default HistorikkContainer;
