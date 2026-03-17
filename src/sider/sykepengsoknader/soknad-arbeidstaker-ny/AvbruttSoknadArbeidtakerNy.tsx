import React from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { BodyShort, Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger",
  avbrutt: "Avbrutt av den sykmeldte",
  avbruttTittel: "Dato avbrutt",
  status: "Status",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function AvbruttSoknadArbeidstaker({ soknad }: Props) {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <Heading size="xsmall" level="3" className="mb-1">
            {texts.status}
          </Heading>
          <BodyShort size="small">{texts.avbrutt}</BodyShort>
        </div>
        <div>
          <Heading size="xsmall" level="3" className="mb-1">
            {texts.avbruttTittel}
          </Heading>
          <BodyShort size="small">
            {tilLesbarDatoMedArstall(soknad.avbruttDato)}
          </BodyShort>
        </div>
      </div>
      <SykmeldingUtdragContainer soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
}
