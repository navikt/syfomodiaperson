import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import * as Tredelt from "@/components/side/TredeltSide";
import { MeldingTilBehandler } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandler";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import { Box, Heading } from "@navikt/ds-react";
import BehandleBehandlerdialogSvarOppgaveKnapp from "./meldinger/BehandleBehandlerdialogSvarOppgaveKnapp";
import Samtaler from "./meldinger/Samtaler";

const texts = {
  title: "Dialog med behandler",
  meldingerHeader: "Meldinger",
};

export default function BehandlerdialogContainer(): ReactElement {
  const { isLoading, isError } = useBehandlerdialogQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.BEHANDLERDIALOG}>
      <SideLaster isLoading={isLoading} isError={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <Box background="default" className="p-4">
              <Heading level="2" size="medium" spacing>
                {texts.meldingerHeader}
              </Heading>
              <BehandleBehandlerdialogSvarOppgaveKnapp />
              <Samtaler />
            </Box>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <MeldingTilBehandler />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
