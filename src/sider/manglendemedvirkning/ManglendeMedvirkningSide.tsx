import React, { ReactElement } from "react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import ForhandsvarselSide from "@/sider/manglendemedvirkning/ForhandsvarselSide";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";

const texts = {
  title: "Manglende medvirkning",
};

export default function ManglendeMedvirkningSide(): ReactElement {
  const { isLoading, isError } = useManglendeMedvirkningVurderingQuery();
  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.MANGLENDE_MEDVIRKNING}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <ForhandsvarselSide />
      </SideLaster>
    </Side>
  );
}
