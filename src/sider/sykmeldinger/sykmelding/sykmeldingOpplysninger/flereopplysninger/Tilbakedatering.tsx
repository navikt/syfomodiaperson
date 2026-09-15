import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";

const texts = {
  begrunnelse: "Begrunnelse",
  dokumenterbarPasientkontakt:
    "Oppgi dato for dokumenterbar kontakt med pasienten",
  title: "Tilbakedatering",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function TilbakedateringSykmeldingssiden({ sykmelding }: Props) {
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
          <BodyLong size="small" className="whitespace-pre-line">
            {tilLesbarDatoMedArstall(
              sykmelding.tilbakedatering.dokumenterbarPasientkontakt,
            )}
          </BodyLong>
        </div>
      )}
      {sykmelding.tilbakedatering.tilbakedatertBegrunnelse && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.begrunnelse}
          </Heading>
          <BodyLong size="small" className="whitespace-pre-line">
            {sykmelding.tilbakedatering.tilbakedatertBegrunnelse}
          </BodyLong>
        </div>
      )}
    </>
  );
}

export function TilbakedateringUtdragFraSykmeldingen({ sykmelding }: Props) {
  return (
    <div>
      <Heading level="3" size="xsmall">
        {texts.title}
      </Heading>
      {sykmelding.tilbakedatering.dokumenterbarPasientkontakt && (
        <div className="mb-2">
          <BodyShort size="small" weight="semibold">
            {texts.dokumenterbarPasientkontakt}
          </BodyShort>
          <BodyLong size="small" className="whitespace-pre-line">
            {tilLesbarDatoMedArstall(
              sykmelding.tilbakedatering.dokumenterbarPasientkontakt,
            )}
          </BodyLong>
        </div>
      )}
      {sykmelding.tilbakedatering.tilbakedatertBegrunnelse && (
        <div className="mb-2">
          <BodyShort size="small" weight="semibold">
            {texts.begrunnelse}
          </BodyShort>
          <BodyLong size="small" className="whitespace-pre-line">
            {sykmelding.tilbakedatering.tilbakedatertBegrunnelse}
          </BodyLong>
        </div>
      )}
    </div>
  );
}
