import { UtropstegnImage } from "../../../img/ImageComponents";
import MotebehovKvittering from "./MotebehovKvittering";
import { FlexRow, PaddingSize } from "../Layout";
import BehandleMotebehovKnapp from "./BehandleMotebehovKnapp";
import { DialogmotePanel } from "../mote/components/DialogmotePanel";
import React from "react";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";

const texts = {
  onskerOmDialogmote: "Ønsker om dialogmøte",
};

interface Props {
  motebehovData: MotebehovVeilederDTO[];
  ledereData: NarmesteLederRelasjonDTO[];
  sykmeldt?: Brukerinfo;
}

export const DialogmoteOnskePanel = ({
  motebehovData,
  ledereData,
  sykmeldt,
}: Props) => {
  return (
    <DialogmotePanel icon={UtropstegnImage} header={texts.onskerOmDialogmote}>
      <MotebehovKvittering
        motebehovData={motebehovData}
        ledereData={ledereData}
        sykmeldt={sykmeldt}
      />

      <FlexRow topPadding={PaddingSize.MD}>
        <BehandleMotebehovKnapp motebehovData={motebehovData} />
      </FlexRow>
    </DialogmotePanel>
  );
};
