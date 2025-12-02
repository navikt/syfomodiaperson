import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { Heading } from "@navikt/ds-react";
import React from "react";
import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";

interface Props {
  plan: OppfolgingsplanDTO;
}

export default function OppfolgingsplanVirksomhetTittel({ plan }: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(
    plan.virksomhet.virksomhetsnummer
  );

  return <Heading size="small">{virksomhetsnavn}</Heading>;
}
