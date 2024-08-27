import { SenOppfolgingVurderingResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Box, Heading } from "@navikt/ds-react";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import React from "react";

const texts = {
  heading: "Forrige vurdering",
  begrunnelse: "Begrunnelse",
  missingBegrunnelse: "Begrunnelse mangler",
};

interface Props {
  vurdering: SenOppfolgingVurderingResponseDTO;
}

export function VurdertKandidat({ vurdering }: Props) {
  const veilederIdent = vurdering.veilederident;
  const { data: veileder } = useVeilederInfoQuery(veilederIdent);
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
        <BodyShort size="small">
          {`Vurdert av ${
            veileder?.fulltNavn() ?? veilederIdent
          } ${toDatePrettyPrint(vurdering.createdAt)}`}
        </BodyShort>
      </div>
    </Box>
  );
}
