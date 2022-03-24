import React, { useEffect } from "react";
import Sidetopp from "../../Sidetopp";
import { useDispatch } from "react-redux";
import { hentMoter } from "@/data/mote/moter_actions";
import { useAppSelector } from "@/hooks/hooks";
import UtdragFraSykefravaeretPanel from "../../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../SideLaster";
import { DialogmoteOnskePanel } from "../../motebehov/DialogmoteOnskePanel";
import { MotehistorikkPanel } from "../../dialogmote/motehistorikk/MotehistorikkPanel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DialogmoteFerdigstilteReferatPanel } from "@/components/dialogmote/DialogmoteFerdigstilteReferatPanel";
import { DialogmoteStatus } from "@/data/dialogmote/types/dialogmoteTypes";

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
    currentLedere,
    isLoading: henterLedere,
    isError: henterLedereFeilet,
  } = useLedereQuery();

  const { moter, navbruker } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(hentMoter(fnr));
  }, [dispatch, fnr]);

  const henter =
    !moter.hentingForsokt ||
    henterDialogmoter ||
    henterOppfolgingsplaner ||
    henterMotebehov ||
    henterLedere;
  const hentingFeilet =
    henterLedereFeilet || henterMotebehovFeilet || henterDialogmoterFeilet;

  return (
    <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
      <Sidetopp tittel={texts.dialogmoter} />

      <DialogmoteOnskePanel
        motebehovData={motebehov}
        ledereData={currentLedere}
        sykmeldt={navbruker.data}
      />

      <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />
      <DialogmoteFerdigstilteReferatPanel
        ferdigstilteMoter={historiskeDialogmoter.filter(
          (mote) => mote.status === DialogmoteStatus.FERDIGSTILT
        )}
      />
      <UtdragFraSykefravaeretPanel aktivePlaner={aktivePlaner} fnr={fnr} />

      <MotehistorikkPanel historiskeMoter={historiskeDialogmoter} />
    </SideLaster>
  );
};

export default Motelandingsside;
