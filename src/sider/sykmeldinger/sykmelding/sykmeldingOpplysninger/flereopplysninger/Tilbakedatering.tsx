import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingOpplysningForFelt from "./SykmeldingOpplysningForFelt";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";

const texts = {
  begrunnelse: "Pasienten har ikke kunne ivareta egne interesser. Begrunn",
  dokumenterbarPasientkontakt:
    "Oppgi dato for dokumenterbar kontakt med pasienten",
  title: "Tilbakedatering",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function Tilbakedatering(tilbakedateringProps: Props) {
  const { sykmelding } = tilbakedateringProps;
  const visSeksjon =
    sykmelding.tilbakedatering.dokumenterbarPasientkontakt ||
    sykmelding.tilbakedatering.tilbakedatertBegrunnelse;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <SykmeldingSeksjon tittel={texts.title}>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.tilbakedatering}
        felt="dokumenterbarPasientkontakt"
        tittel={texts.dokumenterbarPasientkontakt}
        opplysning={tilLesbarDatoMedArstall(
          sykmelding.tilbakedatering.dokumenterbarPasientkontakt
        )}
      />
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.tilbakedatering}
        felt="tilbakedatertBegrunnelse"
        tittel={texts.begrunnelse}
      />
    </SykmeldingSeksjon>
  );
}
