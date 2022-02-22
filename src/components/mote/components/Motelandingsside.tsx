import React, { useEffect } from "react";
import Sidetopp from "../../Sidetopp";
import { useDispatch } from "react-redux";
import { hentMoter } from "@/data/mote/moter_actions";
import { useAppSelector } from "@/hooks/hooks";
import UtdragFraSykefravaeretPanel from "../../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../SideLaster";
import { hentLedere } from "@/data/leder/ledere_actions";
import { hentSykmeldinger } from "@/data/sykmelding/sykmeldinger_actions";
import { hentOppfolgingstilfelleperioder } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder_actions";
import { DialogmoteOnskePanel } from "../../motebehov/DialogmoteOnskePanel";
import { MotehistorikkPanel } from "../../dialogmote/motehistorikk/MotehistorikkPanel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";

const texts = {
  dialogmoter: "Dialogmøter",
};

export const Motelandingsside = () => {
  const fnr = useValgtPersonident();
  const dispatch = useDispatch();

  const {
    isLoading: henterOppfolgingsplaner,
    aktivePlaner,
  } = useOppfolgingsplanerQuery();
  const {
    isLoading: henterDialogmoter,
    isError: henterDialogmoterFeilet,
    aktivtDialogmote,
    historiskeDialogmoter,
  } = useDialogmoterQuery();
  const {
    data: motebehov,
    isError: henterMotebehovFeilet,
    isLoading: henterMotebehov,
  } = useMotebehovQuery();

  const {
    ledere,
    sykmeldinger,
    moter,
    navbruker,
    oppfolgingstilfelleperioder,
  } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(hentLedere(fnr));
    dispatch(hentMoter(fnr));
    dispatch(hentSykmeldinger(fnr));
  }, [dispatch, fnr]);

  useEffect(() => {
    dispatch(hentOppfolgingstilfelleperioder(fnr));
  }, [dispatch, fnr, ledere, sykmeldinger]);

  const harForsoktHentetAlt = ledere.hentingForsokt && moter.hentingForsokt;
  const henter =
    !harForsoktHentetAlt ||
    henterDialogmoter ||
    henterOppfolgingsplaner ||
    henterMotebehov;

  return (
    <SideLaster
      henter={henter}
      hentingFeilet={henterMotebehovFeilet || henterDialogmoterFeilet}
    >
      <Sidetopp tittel={texts.dialogmoter} />

      <DialogmoteOnskePanel
        motebehovData={motebehov}
        ledereData={ledere.currentLedere}
        oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
        sykmeldt={navbruker.data}
      />

      <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />

      <UtdragFraSykefravaeretPanel
        aktivePlaner={aktivePlaner}
        fnr={fnr}
        sykmeldinger={sykmeldinger.data}
      />

      <MotehistorikkPanel historiskeMoter={historiskeDialogmoter} />
    </SideLaster>
  );
};

export default Motelandingsside;
