import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import BekreftetSykmeldingStatuspanel from "../sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

const texts = {
  tittel: "Opplysninger",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function DinBekreftedeSykmelding({ sykmelding }: Props) {
  return (
    <div>
      <BekreftetSykmeldingStatuspanel sykmelding={sykmelding} />
      <SpeilingEkspanderbartPanel
        variant="lyselilla"
        defaultOpen
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
