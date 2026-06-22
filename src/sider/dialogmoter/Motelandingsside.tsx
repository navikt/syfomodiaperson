import React from "react";
import Sidetopp from "../../components/side/Sidetopp";
import SideLaster from "../../components/side/SideLaster";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useGetDialogmoteunntakQuery } from "@/data/dialogmotekandidat/useGetDialogmoteunntakQuery";
import * as Tredelt from "@/components/side/TredeltSide";
import Side from "@/components/side/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import MotehistorikkPanel from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import MotebehovHistorikk from "@/sider/dialogmoter/components/motehistorikk/MotebehovHistorikk";
import { useGetDialogmoteIkkeAktuell } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";
import { MotelandingssidePanels } from "@/sider/dialogmoter/utils/MotelandingssidePanels";
import { harUbehandletMotebehov } from "@/utils/motebehovUtils";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { MoteSvarHistorikkGroupedByMote } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkGroupedByMote.tsx";

const texts = {
  pageTitle: "Møtelandingsside",
  dialogmoter: "Dialogmøter",
};

export default function Motelandingsside() {
  const {
    isLoading: henterDialogmoter,
    isError: henterDialogmoterFeilet,
    aktivtDialogmote,
    ferdigstilteDialogmoter,
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
  const motebehov = useMotebehovQuery();

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

  const hasUbehandletMotebehov = harUbehandletMotebehov(motebehov.data);

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster isLoading={henter} isError={hentingFeilet}>
        <Sidetopp tittel={texts.dialogmoter} />

        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <MotelandingssidePanels
              hasUbehandletMotebehov={hasUbehandletMotebehov}
              ferdigstilteDialogmoter={ferdigstilteDialogmoter}
              aktivtDialogmote={aktivtDialogmote}
            />
          </Tredelt.FirstColumn>

          <Tredelt.SecondColumn className="flex flex-col gap-4">
            <MotehistorikkPanel
              historiskeMoter={historiskeDialogmoter}
              dialogmoteunntak={dialogmoteunntak}
              dialogmoteikkeaktuell={getDialogmoteIkkeAktuell.data}
            />
            <MoteSvarHistorikkGroupedByMote
              historiskeMoter={historiskeDialogmoter}
            />
            <MotebehovHistorikk />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
