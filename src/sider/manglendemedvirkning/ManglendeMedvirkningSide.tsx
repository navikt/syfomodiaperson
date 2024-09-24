import React, { ReactElement } from "react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import UnntakSide from "@/sider/manglendemedvirkning/unntak/UnntakSide";
import OppfyltSide from "@/sider/manglendemedvirkning/oppfylt/OppfyltSide";
import IkkeAktuellSide from "@/sider/manglendemedvirkning/ikkeaktuell/IkkeAktuellSide";
import StansSide from "./stans/StansSide";
import ManglendeMedvirkningHistorikk from "@/sider/manglendemedvirkning/ManglendeMedvirkningHistorikk";

const texts = {
  title: "Manglende medvirkning",
};

export function ManglendeMedvirkningOppfyltSide() {
  return (
    <ManglendeMedvirkningSide>
      <OppfyltSide />
    </ManglendeMedvirkningSide>
  );
}

export function ManglendeMedvirkningStansSide() {
  return (
    <ManglendeMedvirkningSide>
      <StansSide />
    </ManglendeMedvirkningSide>
  );
}

export function ManglendeMedvirkningUnntakSide() {
  return (
    <ManglendeMedvirkningSide>
      <UnntakSide />
    </ManglendeMedvirkningSide>
  );
}

export function ManglendeMedvirkningIkkeAktuellSide() {
  return (
    <ManglendeMedvirkningSide>
      <IkkeAktuellSide />
    </ManglendeMedvirkningSide>
  );
}

interface Props {
  children: ReactElement;
}

export default function ManglendeMedvirkningSide({
  children,
}: Props): ReactElement {
  const { isLoading, isError } = useManglendeMedvirkningVurderingQuery();
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
        {children}
        <ManglendeMedvirkningHistorikk />
      </SideLaster>
    </Side>
  );
}
