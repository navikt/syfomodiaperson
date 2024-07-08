import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import SideLaster from "@/components/SideLaster";
import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenoppfolgingSvarQuery";

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
    </Side>
  );
}
