import { UtropstegnImage } from "../../../../img/ImageComponents";
import MotebehovKvittering from "@/sider/dialogmoter/motebehov/MotebehovKvittering";
import BehandleMotebehovKnapp from "@/components/motebehov/BehandleMotebehovKnapp";
import DialogmotePanel from "@/sider/dialogmoter/components/DialogmotePanel";
import React from "react";
import { InfoOmTolk } from "@/sider/dialogmoter/motebehov/InfoOmTolk";

const texts = {
  behovForDialogmote: "Behov for dialogmøte",
};

export const MotebehovPanel = () => {
  return (
    <>
      <DialogmotePanel icon={UtropstegnImage} header={texts.behovForDialogmote}>
        <MotebehovKvittering />
        <BehandleMotebehovKnapp />
      </DialogmotePanel>
      <InfoOmTolk />
    </>
  );
};
