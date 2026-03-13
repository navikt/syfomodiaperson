import React from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Heading } from "@navikt/ds-react";

const texts = {
  tittel: "Dato avbrutt",
  status: "Status",
  avbrutt: "Avbrutt av sykmeldt",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function AvbruttSoknadSelvstendigStatuspanel({ soknad }: Props) {
  return (
    <div className="mb-4 flex justify-between gap-5">
      <div>
        <Heading size="xsmall" level="3" className="mb-1">
          {texts.status}
        </Heading>
        <BodyShort size="small">{texts.avbrutt}</BodyShort>
      </div>
      <div>
        <Heading size="xsmall" level="3" className="mb-1">
          {texts.tittel}
        </Heading>
        <BodyShort size="small">
          {tilLesbarDatoMedArstall(soknad.avbruttDato)}
        </BodyShort>
      </div>
    </div>
  );
}
