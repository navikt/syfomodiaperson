import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import React from "react";
import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT } from "@/apiConstants";

const texts = {
  apneOppfolgingsplan: "Åpne oppfølgingsplanen (pdf)",
};

interface Props {
  oppfolgingsplan: OppfolgingsplanV2DTO;
}

export default function OppfolgingsplanV2Item({ oppfolgingsplan }: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(
    oppfolgingsplan.virksomhetsnummer
  );
  const opprettet = restdatoTilLesbarDato(oppfolgingsplan.opprettet);
  const deltMedNav = restdatoTilLesbarDato(oppfolgingsplan.deltMedNavTidspunkt);

  return (
    <Box background="surface-default" padding="8" className="mb-2">
      <Heading size="small">{virksomhetsnavn}</Heading>
      <BodyShort>Opprettet: {opprettet}</BodyShort>
      <BodyShort>Delt med Nav: {deltMedNav}</BodyShort>
      <a
        className="lenke"
        href={`${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/${oppfolgingsplan.uuid}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {texts.apneOppfolgingsplan}
      </a>
    </Box>
  );
}
