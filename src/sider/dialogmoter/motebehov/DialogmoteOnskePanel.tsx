import { UtropstegnImage } from "../../../../img/ImageComponents";
import MotebehovKvittering from "./MotebehovKvittering";
import BehandleMotebehovKnapp from "../../../components/motebehov/BehandleMotebehovKnapp";
import { DialogmotePanel } from "@/sider/dialogmoter/components/DialogmotePanel";
import React from "react";

const texts = {
  onskerOmDialogmote: "Ønsker om dialogmøte",
};

export const DialogmoteOnskePanel = () => {
  return (
    <DialogmotePanel icon={UtropstegnImage} header={texts.onskerOmDialogmote}>
      <MotebehovKvittering />
      <BehandleMotebehovKnapp />
    </DialogmotePanel>
  );
};
