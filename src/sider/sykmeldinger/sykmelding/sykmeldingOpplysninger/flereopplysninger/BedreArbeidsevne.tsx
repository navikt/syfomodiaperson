import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  arbeidsevne: "Hva skal til for å bedre arbeidsevnen?",
  tilrettelegging: "Tilrettelegging/hensyn som bør tas på arbeidsplassen",
  tiltakNAV: "Tiltak i regi av Nav",
  tiltakAndre: "Eventuelle andre innspill til Nav",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function BedreArbeidsevne(bedreArbeidsevneProps: Props) {
  const { sykmelding } = bedreArbeidsevneProps;

  return (
    <SykmeldingSeksjon tittel={texts.arbeidsevne}>
      {sykmelding.arbeidsevne.tilretteleggingArbeidsplass && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.tilrettelegging}
          </Heading>
          <BodyLong size="small">
            {sykmelding.arbeidsevne.tilretteleggingArbeidsplass}
          </BodyLong>
        </div>
      )}
      {sykmelding.arbeidsevne.tiltakNAV && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.tiltakNAV}
          </Heading>
          <BodyLong size="small">{sykmelding.arbeidsevne.tiltakNAV}</BodyLong>
        </div>
      )}
      {sykmelding.arbeidsevne.tiltakAndre && (
        <div className="mb-5">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.tiltakAndre}
          </Heading>
          <BodyLong size="small">{sykmelding.arbeidsevne.tiltakAndre}</BodyLong>
        </div>
      )}
    </SykmeldingSeksjon>
  );
}
