import React, { ReactElement } from "react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";

const texts = {
  title: "Manglende medvirkning",
};

export default function ManglendeMedvirkningSide(): ReactElement {
  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.MANGLENDE_MEDVIRKNING}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={false} hentingFeilet={false}>
        Hei
      </SideLaster>
    </Side>
  );
}
