import React, { useEffect } from "react";
import Sidetopp from "../../Sidetopp";
import { useDispatch } from "react-redux";
import { hentMoter } from "@/data/mote/moter_actions";
import { useAppSelector } from "@/hooks/hooks";
import UtdragFraSykefravaeretPanel from "../../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../SideLaster";
import { hentLedere } from "@/data/leder/ledere_actions";
import { hentMotebehov } from "@/data/motebehov/motebehov_actions";
import { hentSykmeldinger } from "@/data/sykmelding/sykmeldinger_actions";
import { hentOppfoelgingsdialoger } from "@/data/oppfolgingsplan/oppfoelgingsdialoger_actions";
import { hentOppfolgingstilfelleperioder } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder_actions";
import { useOppfoelgingsDialoger } from "@/hooks/useOppfoelgingsDialoger";
import { DialogmoteOnskePanel } from "../../motebehov/DialogmoteOnskePanel";
import { MotehistorikkPanel } from "../../dialogmote/motehistorikk/MotehistorikkPanel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const texts = {
  dialogmoter: "Dialogmøter",
};

export const Motelandingsside = () => {
  const fnr = useValgtPersonident();
  const dispatch = useDispatch();

  const {
    aktiveDialoger,
    harForsoktHentetOppfoelgingsdialoger,
  } = useOppfoelgingsDialoger();
  const {
    isLoading: henterDialogmoter,
    isError: henterDialogmoterFeilet,
    aktivtDialogmote,
    historiskeDialogmoter,
  } = useDialogmoterQuery();

  const {
    ledere,
    sykmeldinger,
    moter,
    motebehov,
    navbruker,
    oppfolgingstilfelleperioder,
  } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(hentLedere(fnr));
    dispatch(hentMoter(fnr));
    dispatch(hentMotebehov(fnr));
    dispatch(hentSykmeldinger(fnr));
    dispatch(hentOppfoelgingsdialoger(fnr));
  }, [dispatch, fnr]);

  useEffect(() => {
    dispatch(hentOppfolgingstilfelleperioder(fnr));
  }, [dispatch, fnr, ledere, sykmeldinger]);

  const harForsoktHentetAlt =
    motebehov.hentingForsokt &&
    harForsoktHentetOppfoelgingsdialoger &&
    ledere.hentingForsokt &&
    moter.hentingForsokt;

  return (
    <SideLaster
      henter={!harForsoktHentetAlt || henterDialogmoter}
      hentingFeilet={motebehov.hentingFeilet || henterDialogmoterFeilet}
    >
      <Sidetopp tittel={texts.dialogmoter} />

      <DialogmoteOnskePanel
        motebehovData={motebehov.data}
        ledereData={ledere.currentLedere}
        oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
        sykmeldt={navbruker.data}
      />

      <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />

      <UtdragFraSykefravaeretPanel
        aktiveDialoger={aktiveDialoger}
        fnr={fnr}
        oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
        sykmeldinger={sykmeldinger.data}
      />

      <MotehistorikkPanel historiskeMoter={historiskeDialogmoter} />
    </SideLaster>
  );
};

export default Motelandingsside;
