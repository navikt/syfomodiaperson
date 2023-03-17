import React from "react";
import { SkrivTilBehandler } from "@/components/behandlerdialog/skrivtilbehandler/SkrivTilBehandler";
import styled from "styled-components";
import { Panel } from "@navikt/ds-react";

export const BehandlerdialogPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  padding: 2em;
  margin-bottom: 1em;
`;

export const BehandlerdialogSide = () => {
  return (
    <BehandlerdialogPanel>
      <SkrivTilBehandler />
    </BehandlerdialogPanel>
  );
};
