import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, Heading } from "@navikt/ds-react";

const texts = {
  status: "Status",
  avvistAvNav: "Avvist av Nav",
  datoAvvist: "Dato avvist",
  bekreftetAvDenSykmeldte: "Bekreftet av den sykmeldte",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AvvistSykmeldingStatuspanel({
  sykmelding,
}: Props): ReactElement {
  return (
    <div className="mb-4 flex justify-between gap-2">
      <div>
        <Heading size="xsmall" level="3">
          {texts.status}
        </Heading>
        <BodyShort size="small">{texts.avvistAvNav}</BodyShort>
      </div>
      <div>
        <Heading size="xsmall" level="3">
          {texts.datoAvvist}
        </Heading>
        <BodyShort size="small">
          {tilLesbarDatoMedArstall(sykmelding.mottattTidspunkt)}
        </BodyShort>
      </div>
      <div>
        <Heading size="xsmall" level="3">
          {texts.bekreftetAvDenSykmeldte}
        </Heading>
        <BodyShort size="small">
          {tilLesbarDatoMedArstall(sykmelding.sendtdato)}
        </BodyShort>
      </div>
    </div>
  );
}
