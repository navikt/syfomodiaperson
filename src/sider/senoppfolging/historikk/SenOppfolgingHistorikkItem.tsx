import { Accordion, BodyShort, Label, VStack } from "@navikt/ds-react";
import React from "react";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingVurderingResponseDTO,
  SenOppfolgingVurderingType,
  SvarResponseDTO,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import VurdertAv from "@/sider/senoppfolging/VurdertAv";

const texts = {
  ikkeSvart: "Sykmeldte svarte ikke",
  ikkeVurdert: "Ikke vurdert",
  begrunnelse: {
    label: "Begrunnelse",
    missing: "Begrunnelse mangler",
  },
};

interface VurderingProps {
  vurdering: SenOppfolgingVurderingResponseDTO;
}

function Vurdering({ vurdering }: VurderingProps) {
  return (
    <div>
      <VurdertAv vurdering={vurdering} />
      {vurdering.begrunnelse ? (
        <>
          <Label size="small">{texts.begrunnelse.label}</Label>
          <BodyShort size="small">{vurdering.begrunnelse}</BodyShort>
        </>
      ) : (
        <BodyShort size="small">{texts.begrunnelse.missing}</BodyShort>
      )}
    </div>
  );
}

interface Props {
  kandidat: SenOppfolgingKandidatResponseDTO;
}

function headerText(kandidat: SenOppfolgingKandidatResponseDTO): string {
  return kandidat.varselAt
    ? `Sykmeldte fikk varsel ${toDatePrettyPrint(kandidat.varselAt)}`
    : `Sykmeldte svarte ${toDatePrettyPrint(kandidat.svar?.svarAt)}`;
}
function svarTekst(svar: SvarResponseDTO) {
  return `Sykmeldte svarte ${toDatePrettyPrint(svar.svarAt)}: ${
    svar.onskerOppfolging ? "Ønsker oppfølging" : "Ønsker ikke oppfølging"
  }`;
}

export function SenOppfolgingHistorikkItem({ kandidat }: Props) {
  const { svar, vurderinger } = kandidat;
  const vurdering = vurderinger.find(
    ({ type }) => type === SenOppfolgingVurderingType.FERDIGBEHANDLET
  );

  return (
    <Accordion.Item>
      <Accordion.Header>{headerText(kandidat)}</Accordion.Header>
      <Accordion.Content>
        <VStack gap="4">
          <BodyShort size="small">
            {svar ? svarTekst(svar) : texts.ikkeSvart}
          </BodyShort>
          {vurdering ? <Vurdering vurdering={vurdering} /> : texts.ikkeVurdert}
        </VStack>
      </Accordion.Content>
    </Accordion.Item>
  );
}
