import React from "react";
import Sidetopp from "../../components/side/Sidetopp";
import UtdragFraSykefravaeretPanel from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./components/innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../components/side/SideLaster";
import { DialogmoteOnskePanel } from "./motebehov/DialogmoteOnskePanel";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DialogmoteFerdigstilteReferatPanel } from "@/sider/dialogmoter/components/DialogmoteFerdigstilteReferatPanel";
import { DialogmoteStatus } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import * as Tredelt from "@/components/side/TredeltSide";
import Side from "@/components/side/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { MotehistorikkPanel } from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import { MoteSvarHistorikk } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikk";
import MotebehovHistorikk from "@/sider/dialogmoter/components/motehistorikk/MotebehovHistorikk";
import { InfoOmTolk } from "@/sider/dialogmoter/motebehov/InfoOmTolk";

const texts = {
  pageTitle: "Møtelandingsside",
  dialogmoter: "Dialogmøter",
};

export function Motelandingsside() {
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
  } = useDialogmoteunntakQuery();
  const { isLoading: henterLedere, isError: henterLedereFeilet } =
    useLedereQuery();

  const henter = henterDialogmoter || henterDialogmoteunntak || henterLedere;
  const hentingFeilet =
    henterLedereFeilet ||
    henterDialogmoterFeilet ||
    henterDialogmoteunntakFeilet;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.dialogmoter} />

        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <DialogmoteOnskePanel />
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
            />
            <MoteSvarHistorikk historiskeMoter={historiskeDialogmoter} />
            <MotebehovHistorikk />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}

export default Motelandingsside;
