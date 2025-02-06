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
import MotebehovHistorikk from "@/sider/dialogmoter/components/motehistorikk/MotebehovHistorikk";
import {
  getMotebehovInActiveTilfelle,
  getUbehandletSvarOgMeldtBehov,
  sorterMotebehovDataEtterDato,
} from "@/utils/motebehovUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

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
  const useGetMotebehov = useMotebehovQuery();
  const { isLoading: henterLedere, isError: henterLedereFeilet } =
    useLedereQuery();

  const henter =
    henterDialogmoter ||
    henterDialogmoteunntak ||
    useGetMotebehov.isLoading ||
    henterLedere;
  const hentingFeilet =
    henterLedereFeilet ||
    useGetMotebehov.isError ||
    henterDialogmoterFeilet ||
    henterDialogmoteunntakFeilet;

  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  function showDialogmotebehovPanel(
    motebehov: MotebehovVeilederDTO[],
    latestOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
  ): boolean {
    const motebehovInLatestOppfolgingstilfelle = getMotebehovInActiveTilfelle(
      motebehov?.sort(sorterMotebehovDataEtterDato),
      latestOppfolgingstilfelle
    );

    if (
      motebehovInLatestOppfolgingstilfelle.length > 0 &&
      latestOppfolgingstilfelle
    ) {
      return true;
    } else {
      return getUbehandletSvarOgMeldtBehov(motebehov).length > 0;
    }
  }

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.dialogmoter} />

        <Tredelt.Container>
          <Tredelt.FirstColumn>
            {showDialogmotebehovPanel(
              useGetMotebehov.data,
              latestOppfolgingstilfelle
            ) && <DialogmoteOnskePanel />}
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
