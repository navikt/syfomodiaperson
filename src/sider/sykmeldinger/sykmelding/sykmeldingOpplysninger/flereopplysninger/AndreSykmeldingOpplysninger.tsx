import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingOpplysningForFelt from "./SykmeldingOpplysningForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";

const texts = {
  phone: "Telefon til lege/sykmelder",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AndreSykmeldingOpplysninger(
  andreSykmeldingOpplysningerProps: Props
) {
  const { sykmelding } = andreSykmeldingOpplysningerProps;
  const visSeksjon =
    sykmelding.bekreftelse.sykmelderTlf ||
    sykmelding.bekreftelse.utstedelsesdato;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <SykmeldingSeksjon tittel={"Annet"}>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.bekreftelse}
        felt={"sykmelderTlf"}
        tittel={texts.phone}
      />
    </SykmeldingSeksjon>
  );
}
