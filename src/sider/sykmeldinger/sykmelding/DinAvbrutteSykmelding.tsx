import React from "react";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

const texts = {
  dineOpplysninger: "Dine opplysninger",
};

interface DinAvbrutteSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const DinAvbrutteSykmelding = ({ sykmelding }: DinAvbrutteSykmeldingProps) => {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SpeilingEkspanderbartPanel
        variant="lysebla"
        defaultOpen
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.dineOpplysninger}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </SpeilingEkspanderbartPanel>
    </div>
  );
};

export default DinAvbrutteSykmelding;
