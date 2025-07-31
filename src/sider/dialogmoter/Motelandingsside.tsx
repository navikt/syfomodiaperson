import React from "react";
import Sidetopp from "../../components/side/Sidetopp";
import UtdragFraSykefravaeretPanel from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import InnkallingDialogmotePanel from "./components/innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../components/side/SideLaster";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DialogmoteFerdigstilteReferatPanel } from "@/sider/dialogmoter/components/DialogmoteFerdigstilteReferatPanel";
import { DialogmoteStatus } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useGetDialogmoteunntakQuery } from "@/data/dialogmotekandidat/useGetDialogmoteunntakQuery";
import * as Tredelt from "@/components/side/TredeltSide";
import Side from "@/components/side/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import MotehistorikkPanel from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import MoteSvarHistorikk from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikk";
import MotebehovHistorikk from "@/sider/dialogmoter/components/motehistorikk/MotebehovHistorikk";
import { InfoOmTolk } from "@/sider/dialogmoter/motebehov/InfoOmTolk";
import { UtropstegnImage } from "../../../img/ImageComponents";
import MotebehovKvittering from "@/sider/dialogmoter/motebehov/MotebehovKvittering";
import BehandleMotebehovKnapp from "@/components/motebehov/BehandleMotebehovKnapp";
import DialogmotePanel from "@/sider/dialogmoter/components/DialogmotePanel";
import { useGetDialogmoteIkkeAktuell } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";

const texts = {
  pageTitle: "Møtelandingsside",
  dialogmoter: "Dialogmøter",
  behovForDialogmote: "Behov for dialogmøte",
};

export default function Motelandingsside() {
  const {
    isLoading: henterDialogmoter,
    isError: henterDialogmoterFeilet,
    aktivtDialogmote,
    historiskeDialogmoter,
  } = useDialogmoterQuery();
  const {
    data: dialogmoteunntak,
    isError: henterDialogmoteunntakFeilet,
    isLoading: henterDialogmoteunntak,
  } = useGetDialogmoteunntakQuery();
  const getDialogmoteIkkeAktuell = useGetDialogmoteIkkeAktuell();
  const { isLoading: henterLedere, isError: henterLedereFeilet } =
    useLedereQuery();

  const henter =
    henterDialogmoter ||
    henterDialogmoteunntak ||
    henterLedere ||
    getDialogmoteIkkeAktuell.isLoading;
  const hentingFeilet =
    henterLedereFeilet ||
    henterDialogmoterFeilet ||
    henterDialogmoteunntakFeilet ||
    getDialogmoteIkkeAktuell.isError;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.dialogmoter} />

        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <DialogmotePanel
              icon={UtropstegnImage}
              header={texts.behovForDialogmote}
            >
              <MotebehovKvittering />
              <BehandleMotebehovKnapp />
            </DialogmotePanel>
            <InfoOmTolk />
            <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />
            <DialogmoteFerdigstilteReferatPanel
              ferdigstilteMoter={historiskeDialogmoter.filter(
                (mote) => mote.status === DialogmoteStatus.FERDIGSTILT
              )}
            />
            <UtdragFraSykefravaeretPanel />
          </Tredelt.FirstColumn>

          <Tredelt.SecondColumn className="flex flex-col gap-4">
            <MotehistorikkPanel
              historiskeMoter={historiskeDialogmoter}
              dialogmoteunntak={dialogmoteunntak}
              dialogmoteikkeaktuell={getDialogmoteIkkeAktuell.data}
            />
            <MoteSvarHistorikk historiskeMoter={historiskeDialogmoter} />
            <MotebehovHistorikk />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
