import React from "react";
import Sidetopp from "../../components/Sidetopp";
import UtdragFraSykefravaeretPanel from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { InnkallingDialogmotePanel } from "./components/innkalling/InnkallingDialogmotePanel";
import SideLaster from "../../components/SideLaster";
import { DialogmoteOnskePanel } from "./motebehov/DialogmoteOnskePanel";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { DialogmoteFerdigstilteReferatPanel } from "@/sider/dialogmoter/components/DialogmoteFerdigstilteReferatPanel";
import { DialogmoteStatus } from "@/data/dialogmote/types/dialogmoteTypes";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import * as Tredelt from "@/sider/TredeltSide";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { MotehistorikkPanel } from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import { MoteSvarHistorikk } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikk";

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

  const henter =
    henterDialogmoter ||
    henterDialogmoteunntak ||
    henterMotebehov ||
    henterLedere;
  const hentingFeilet =
    henterLedereFeilet ||
    henterMotebehovFeilet ||
    henterDialogmoterFeilet ||
    henterDialogmoteunntakFeilet;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.dialogmoter} />

        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <DialogmoteOnskePanel
              motebehovData={motebehov}
              ledereData={currentLedere}
            />

            <InnkallingDialogmotePanel aktivtDialogmote={aktivtDialogmote} />
            <DialogmoteFerdigstilteReferatPanel
              ferdigstilteMoter={historiskeDialogmoter.filter(
                (mote) => mote.status === DialogmoteStatus.FERDIGSTILT
              )}
            />
            <UtdragFraSykefravaeretPanel />
          </Tredelt.FirstColumn>

          <Tredelt.SecondColumn>
            <div className="flex flex-col gap-4">
              <MotehistorikkPanel
                historiskeMoter={historiskeDialogmoter}
                dialogmoteunntak={dialogmoteunntak}
              />
              <MoteSvarHistorikk historiskeMoter={historiskeDialogmoter} />
            </div>
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}

export default Motelandingsside;
