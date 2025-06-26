import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import SideLaster from "@/components/side/SideLaster";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import * as Tredelt from "@/components/side/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { VurderingHistorikk } from "@/sider/arbeidsuforhet/historikk/VurderingHistorikk";
import NyttigeLenkerBox from "@/sider/arbeidsuforhet/NyttigeLenkerBox";
import { Outlet } from "react-router-dom";

const texts = {
  title: "Arbeidsuførhet",
};

export default function ArbeidsuforhetSide(): ReactElement {
  const { isLoading, isError } = useGetArbeidsuforhetVurderingerQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.ARBEIDSUFORHET}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <Outlet />
            <VurderingHistorikk />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <UtdragFraSykefravaeret />
            <NyttigeLenkerBox />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
