import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";

const texts = {
  phone: "Telefon til lege/sykmelder",
};

interface AndreSykmeldingOpplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

const AndreSykmeldingOpplysninger = (
  andreSykmeldingOpplysningerProps: AndreSykmeldingOpplysningerProps
) => {
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
};

export default AndreSykmeldingOpplysninger;
