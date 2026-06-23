import React from "react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import BehandleOppfolgingsplanLPS from "./BehandleOppfolgingsplanLPS";
import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { BodyShort, Box, Heading, Link, Tag, VStack } from "@navikt/ds-react";

const texts = {
  buttonOpenPlan: "Åpne oppfølgingsplanen (pdf)",
};

interface Props {
  oppfolgingsplanLPSBistandsbehov: OppfolgingsplanLPS;
}

export default function OppfolgingsplanerOversiktLPS({
  oppfolgingsplanLPSBistandsbehov,
}: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(
    oppfolgingsplanLPSBistandsbehov.virksomhetsnummer,
  );

  return (
    <Box
      background="default"
      padding="space-16"
      className="mb-2"
      data-testid="oppfolgingsplan-lps"
    >
      <Heading size="small">{virksomhetsnavn}</Heading>
      <VStack align="baseline" gap="space-4">
        <BodyShort size="small">
          Mottatt:{" "}
          {restdatoTilLesbarDato(oppfolgingsplanLPSBistandsbehov.opprettet)}
        </BodyShort>
        <Tag data-color="info" variant="outline">
          LPS
        </Tag>
        <Link
          href={`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${oppfolgingsplanLPSBistandsbehov.uuid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {texts.buttonOpenPlan}
        </Link>
        <BehandleOppfolgingsplanLPS
          oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov}
        />
      </VStack>
    </Box>
  );
}
