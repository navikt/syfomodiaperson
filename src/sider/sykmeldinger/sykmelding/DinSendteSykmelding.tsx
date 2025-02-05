import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

const texts = {
  tittel: "Dine opplysinger",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function DinSendteSykmelding({ sykmelding }: Props) {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SpeilingEkspanderbartPanel
        defaultOpen
        variant="lysebla"
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.tittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </SpeilingEkspanderbartPanel>
    </div>
  );
}
