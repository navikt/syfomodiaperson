import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { BodyLong, Heading } from "@navikt/ds-react";

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

  return (
    <>
      <Heading level="3" size="medium">
        {texts.title}
      </Heading>
      {sykmelding.tilbakedatering.dokumenterbarPasientkontakt && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.dokumenterbarPasientkontakt}
          </Heading>
          <BodyLong size="small">
            {tilLesbarDatoMedArstall(
              sykmelding.tilbakedatering.dokumenterbarPasientkontakt
            )}
          </BodyLong>
        </div>
      )}
      {sykmelding.tilbakedatering.tilbakedatertBegrunnelse && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.begrunnelse}
          </Heading>
          <BodyLong size="small">
            {sykmelding.tilbakedatering.tilbakedatertBegrunnelse}
          </BodyLong>
        </div>
      )}
    </>
  );
}
