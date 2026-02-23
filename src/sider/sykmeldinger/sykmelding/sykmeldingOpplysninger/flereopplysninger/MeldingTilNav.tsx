import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingSeksjon } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingSeksjon";
import { BodyLong, Checkbox, Heading } from "@navikt/ds-react";

const texts = {
  begrunnelse: "Begrunn nærmere",
  bistandNav: "Ønskes bistand fra Nav nå?",
  meldingTilNav: "Melding til Nav",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function MeldingTilNav({ sykmelding }: Props) {
  return (
    <SykmeldingSeksjon tittel={texts.meldingTilNav}>
      {sykmelding.meldingTilNav.navBoerTaTakISaken && (
        <Checkbox checked readOnly size="small">
          {texts.bistandNav}
        </Checkbox>
      )}
      {sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse && (
        <div className="mb-5 ml-6">
          <Heading level="4" size="xsmall" className="mb-1">
            {texts.begrunnelse}
          </Heading>
          <BodyLong size="small">
            {sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse}
          </BodyLong>
        </div>
      )}
    </SykmeldingSeksjon>
  );
}
