import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import { BehandlerdialogSide } from "@/sider/behandlerdialog/BehandlerdialogSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const texts = {
  title: "Dialog med behandler",
};

export const BehandlerdialogContainer = (): ReactElement => {
  const henter = false;
  const hentingFeilet = false;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.BEHANDLERDIALOG}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.title} />
        <BehandlerdialogSide />
      </SideLaster>
    </Side>
  );
};
