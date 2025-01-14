import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import ArbeidsgiversSykmelding from "./ArbeidsgiversSykmelding";
import BekreftetSykmeldingStatuspanel from "../sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

const texts = {
  tittel: "Dine opplysinger",
};

interface DinBekreftedeSykmeldingProps {
  dinSykmelding: SykmeldingOldFormat;
  arbeidsgiversSykmelding: SykmeldingOldFormat;
}

const DinBekreftedeSykmelding = ({
  dinSykmelding,
  arbeidsgiversSykmelding,
}: DinBekreftedeSykmeldingProps) => {
  return (
    <div>
      <BekreftetSykmeldingStatuspanel sykmelding={dinSykmelding} />
      <SpeilingEkspanderbartPanel
        variant="lyselilla"
        defaultOpen
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.tittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <SykmeldingOpplysninger sykmelding={dinSykmelding} />
      </SpeilingEkspanderbartPanel>
      {dinSykmelding.valgtArbeidssituasjon === "ARBEIDSTAKER" && (
        <div className="blokk">
          <ArbeidsgiversSykmelding sykmelding={arbeidsgiversSykmelding} />
        </div>
      )}
    </div>
  );
};

export default DinBekreftedeSykmelding;
