import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  title: "Melding til arbeidsgiver",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function MeldingTilArbeidsgiver(
  meldingTilArbeidsgiverProps: Props
) {
  const { sykmelding } = meldingTilArbeidsgiverProps;

  return (
    <div>
      <Heading level="3" size="medium" className="my-5">
        {texts.title}
      </Heading>
      <BodyLong size="small" className="mb-5">
        {sykmelding.innspillTilArbeidsgiver}
        hei arbeidsgiver
      </BodyLong>
    </div>
  );
}
