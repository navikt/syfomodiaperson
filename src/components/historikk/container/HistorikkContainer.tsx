import React, { ReactElement, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import Side from "../../../sider/Side";
import Historikk from "../Historikk";
import { HISTORIKK } from "@/enums/menypunkter";
import SideLaster from "../../SideLaster";
import { useAppSelector } from "@/hooks/hooks";
import { useLedere } from "@/hooks/useLedere";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { hentHistorikk } from "@/data/historikk/historikk_actions";
import { hentLedere } from "@/data/leder/ledere_actions";
import { hentOppfolgingstilfelleperioder } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder_actions";
import { tilfellerFromTilfelleperioder } from "@/utils/periodeUtils";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledere";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import IngenHistorikk from "../IngenHistorikk";
import { useHistorikk } from "@/data/historikk/historikk_hooks";
import Sidetopp from "../../Sidetopp";

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
    hentetHistorikk,
    hentingHistorikkFeilet,
    skalHenteMoter,
    skalHenteMotebehov,
    skalHenteOppfoelgingsdialoger,
    moteHistorikk,
    motebehovHistorikk,
    oppfoelgingsdialogHistorikk,
  } = useHistorikk();
  const oppfolgingstilfelleperioder = useAppSelector(
    (state) => state.oppfolgingstilfelleperioder
  );

  const {
    henterLedere,
    hentingLedereFeilet,
    currentLedere,
    formerLedere,
  } = useLedere();
  const henterTilfeller = Object.keys(oppfolgingstilfelleperioder).some(
    (orgnummer) => oppfolgingstilfelleperioder[orgnummer].henter
  );
  const henter = henterLedere || henterTilfeller || henterHistorikk;
  const hentingFeilet = hentingLedereFeilet || hentingHistorikkFeilet;

  const allLedere = useMemo(() => [...currentLedere, ...formerLedere], [
    currentLedere,
    formerLedere,
  ]);

  useEffect(() => {
    if (skalHenteMoter) {
      dispatch(hentHistorikk(fnr, "MOTER"));
    }
  }, [dispatch, fnr, skalHenteMoter]);

  useEffect(() => {
    if (skalHenteMotebehov) {
      dispatch(hentHistorikk(fnr, "MOTEBEHOV"));
    }
  }, [dispatch, fnr, skalHenteMotebehov]);

  useEffect(() => {
    if (skalHenteOppfoelgingsdialoger) {
      dispatch(hentHistorikk(fnr, "OPPFOELGINGSDIALOG"));
    }
  }, [dispatch, fnr, skalHenteOppfoelgingsdialoger]);

  useEffect(() => {
    dispatch(hentLedere(fnr));
  }, [dispatch, fnr]);

  useEffect(() => {
    if (allLedere && allLedere.length > 0) {
      dispatch(hentOppfolgingstilfelleperioder(fnr));
    }
  }, [dispatch, fnr, allLedere]);

  const tilfeller = tilfellerFromTilfelleperioder(oppfolgingstilfelleperioder);
  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);
  const historikkEvents = motebehovHistorikk
    .concat(moteHistorikk)
    .concat(oppfoelgingsdialogHistorikk)
    .concat(lederHistorikk);
  const ingenHistorikk =
    tilfeller.length === 0 || (hentetHistorikk && historikkEvents.length === 0);

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
