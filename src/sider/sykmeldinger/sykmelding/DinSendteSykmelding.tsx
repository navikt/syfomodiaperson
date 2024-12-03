import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import ArbeidsgiversSykmelding from "./ArbeidsgiversSykmelding";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

const texts = {
  tittel: "Dine opplysinger",
};

interface Props {
  dinSykmelding: SykmeldingOldFormat;
  arbeidsgiversSykmelding: SykmeldingOldFormat;
}

export function DinSendteSykmelding({
  dinSykmelding,
  arbeidsgiversSykmelding,
}: Props) {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={dinSykmelding} />
      <SpeilingEkspanderbartPanel
        defaultOpen
        variant="lysebla"
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.tittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <SykmeldingOpplysninger sykmelding={dinSykmelding} />
      </SpeilingEkspanderbartPanel>
      <div className="blokk--l">
        <ArbeidsgiversSykmelding sykmelding={arbeidsgiversSykmelding} />
      </div>
    </div>
  );
}
