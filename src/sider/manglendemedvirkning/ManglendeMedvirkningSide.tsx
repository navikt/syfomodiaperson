import React from "react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/side/Sidetopp";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import ManglendeMedvirkningHistorikk from "@/sider/manglendemedvirkning/ManglendeMedvirkningHistorikk";
import NyttigeLenkerBox from "@/sider/manglendemedvirkning/NyttigeLenkerBox";
import { Outlet } from "react-router-dom";

const texts = {
  title: "Manglende medvirkning",
};

export default function ManglendeMedvirkningSide() {
  const { isLoading, isError } = useManglendemedvirkningVurderingQuery();
  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.MANGLENDE_MEDVIRKNING}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster
        henter={isLoading}
        hentingFeilet={isError}
        className="flex flex-col gap-2"
      >
        <Outlet />
        <ManglendeMedvirkningHistorikk />
        <NyttigeLenkerBox />
      </SideLaster>
    </Side>
  );
}
