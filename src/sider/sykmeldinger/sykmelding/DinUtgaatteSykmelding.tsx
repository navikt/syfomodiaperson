import React from "react";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

const texts = {
  tittel: "Dine opplysninger",
};

interface DinUtgaatteSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const DinUtgatteSykmelding = ({ sykmelding }: DinUtgaatteSykmeldingProps) => {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SpeilingEkspanderbartPanel
        variant="lysebla"
        defaultOpen
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="lege">
            {texts.tittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </SpeilingEkspanderbartPanel>
    </div>
  );
};

export default DinUtgatteSykmelding;
