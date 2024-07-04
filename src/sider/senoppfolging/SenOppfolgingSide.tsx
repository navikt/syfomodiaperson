import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import SideLaster from "@/components/SideLaster";
import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenoppfolgingSvarQuery";
import * as Tredelt from "../TredeltSide";
import { Box, Tabs } from "@navikt/ds-react";
import { SykmeldingerForVirksomhet } from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Samtaler } from "@/sider/behandlerdialog/meldinger/Samtaler";
import { MotehistorikkPanel } from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";

const texts = {
  title: "Snart slutt på sykepengene",
};

export default function SenOppfolgingSide(): ReactElement {
  const { isError, isPending } = useSenOppfolgingSvarQuery();
  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.SENOPPFOLGING}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isPending} hentingFeilet={isError}>
        <SenOppfolging />
      </SideLaster>
      <Tredelt.Container>
        <Tredelt.FirstColumn>
          <SenOppfolging />
        </Tredelt.FirstColumn>
        <Tredelt.SecondColumn>
          <Box background="surface-default">
            <Tabs defaultValue="sykmeldinger">
              <Tabs.List>
                <Tabs.Tab value="sykmeldinger" label="Sykmeldinger" />
                <Tabs.Tab
                  value="dialog-med-behandler"
                  label="Dialog med behandler"
                />
                <Tabs.Tab value="motehistorikk" label="Møtehistorikk" />
              </Tabs.List>
              <div className="p-4">
                <Tabs.Panel value="sykmeldinger">
                  <SykmeldingerForVirksomhet />
                </Tabs.Panel>
                <Tabs.Panel value="dialog-med-behandler">
                  <Samtaler />
                </Tabs.Panel>
                <Tabs.Panel value="motehistorikk">
                  <MotehistorikkPanel />
                </Tabs.Panel>
              </div>
            </Tabs>
          </Box>
        </Tredelt.SecondColumn>
      </Tredelt.Container>
    </Side>
  );
}
