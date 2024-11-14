import { SenOppfolgingVurderingResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import React from "react";
import VurdertAv from "@/sider/senoppfolging/VurdertAv";

const texts = {
  heading: "Forrige vurdering",
  begrunnelse: "Begrunnelse",
  missingBegrunnelse: "Begrunnelse mangler",
};

interface Props {
  vurdering: SenOppfolgingVurderingResponseDTO;
}

export function VurdertKandidat({ vurdering }: Props) {
  const vurderingText = vurdering.begrunnelse
    ? vurdering.begrunnelse
    : texts.missingBegrunnelse;

  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <div>
        <BodyLong size="small">{vurderingText}</BodyLong>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <CheckmarkCircleFillIcon
          fontSize="2em"
          color="var(--a-icon-success)"
          title="suksess-ikon"
        />
        <VurdertAv vurdering={vurdering} />
      </div>
    </Box>
  );
}
