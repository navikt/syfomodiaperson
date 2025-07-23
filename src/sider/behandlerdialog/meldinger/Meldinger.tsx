import React from "react";
import { Box, Heading } from "@navikt/ds-react";
import Samtaler from "@/sider/behandlerdialog/meldinger/Samtaler";
import BehandleBehandlerdialogSvarOppgaveKnapp from "@/sider/behandlerdialog/meldinger/BehandleBehandlerdialogSvarOppgaveKnapp";

export const texts = {
  header: "Meldinger",
};

export default function Meldinger() {
  return (
    <Box background="surface-default" className="p-4">
      <Heading level="2" size="medium" spacing>
        {texts.header}
      </Heading>
      <BehandleBehandlerdialogSvarOppgaveKnapp />
      <Samtaler />
    </Box>
  );
}
