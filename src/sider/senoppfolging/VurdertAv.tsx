import { toDatePrettyPrint } from "@/utils/datoUtils";
import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { SenOppfolgingVurderingResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

interface Props {
  vurdering: SenOppfolgingVurderingResponseDTO;
}

export default function VurdertAv({ vurdering }: Props) {
  const veilederIdent = vurdering.veilederident;
  const { data: veileder } = useVeilederInfoQuery(veilederIdent);

  return (
    <BodyShort size="small">
      {`Vurdert av ${
        veileder?.fulltNavn() ?? veilederIdent
      } ${toDatePrettyPrint(vurdering.createdAt)}`}
    </BodyShort>
  );
}
