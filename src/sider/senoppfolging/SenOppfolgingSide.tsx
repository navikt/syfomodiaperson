import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import SenOppfolging from "@/sider/senoppfolging/SenOppfolging";
import SideLaster from "@/components/SideLaster";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";

const texts = {
  title: "Snart slutt på sykepengene",
};

export default function SenOppfolgingSide(): ReactElement {
  const { isError, isPending } = useSenOppfolgingKandidatQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.SENOPPFOLGING}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isPending} hentingFeilet={isError}>
        <SenOppfolging />
      </SideLaster>
    </Side>
  );
}
