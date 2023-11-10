import React from "react";
import { AktivitetskravVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BodyShort, Heading, Panel, Tag } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { VarselBrev } from "@/components/aktivitetskrav/VarselBrev";

const texts = {
  title: "Oppsummering fra forhåndsvarselet",
  merInfo: "Husk å sjekke Gosys og Modia for mer informasjon før du vurderer. ",
};

interface ForhandsvarselOppsummeringProps {
  aktivitetskravVurdering: AktivitetskravVurderingDTO;
}

export const ForhandsvarselOppsummering = ({
  aktivitetskravVurdering,
}: ForhandsvarselOppsummeringProps) => {
  const fristDato = tilLesbarDatoMedArUtenManedNavn(
    aktivitetskravVurdering.varsel?.svarfrist
  );

  return (
    <Panel className="flex flex-col mb-4 gap-4 px-8">
      <div className="flex flex-row justify-between items-center">
        <Heading size="small" level="3">
          {texts.title}
        </Heading>
        <Tag variant="warning-moderate">{`Frist: ${fristDato}`}</Tag>
      </div>
      <Panel className="border-gray-400 rounded p-4 max-h-24 overflow-scroll">
        <BodyShort>{aktivitetskravVurdering.beskrivelse}</BodyShort>
      </Panel>
      {aktivitetskravVurdering.varsel && (
        <VarselBrev varsel={aktivitetskravVurdering.varsel} />
      )}
      <BodyShort>{texts.merInfo}</BodyShort>
    </Panel>
  );
};
