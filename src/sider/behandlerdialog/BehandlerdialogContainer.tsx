import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import * as Tredelt from "@/components/side/TredeltSide";
import { MeldingTilBehandler } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandler";
import { Meldinger } from "@/sider/behandlerdialog/meldinger/Meldinger";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";

const texts = {
  title: "Dialog med behandler",
};

export const BehandlerdialogContainer = (): ReactElement => {
  const { isLoading, isError } = useBehandlerdialogQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.BEHANDLERDIALOG}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <Meldinger />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <MeldingTilBehandler />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
