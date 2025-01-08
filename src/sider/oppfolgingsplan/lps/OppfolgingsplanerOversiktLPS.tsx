import React from "react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import BehandleOppfolgingsplanLPS from "./BehandleOppfolgingsplanLPS";
import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { Box, Heading, Tag } from "@navikt/ds-react";

const texts = {
  buttonOpenPlan: "Åpne oppfølgingsplanen(pdf)",
};

interface OpenPlanButtonProps {
  oppfolgingsplanLPS: OppfolgingsplanLPS;
}

function OpenPlanButton(buttonOpenPlanProps: OpenPlanButtonProps) {
  return (
    <a
      className="lenke"
      href={`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${buttonOpenPlanProps.oppfolgingsplanLPS.uuid}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {texts.buttonOpenPlan}
    </a>
  );
}

interface Props {
  oppfolgingsplanLPSBistandsbehov: OppfolgingsplanLPS;
}

export default function OppfolgingsplanerOversiktLPS({
  oppfolgingsplanLPSBistandsbehov,
}: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(
    oppfolgingsplanLPSBistandsbehov.virksomhetsnummer
  );

  return (
    <Box
      background="surface-default"
      padding="8"
      className="mb-2"
      data-testid="oppfolgingsplan-lps"
    >
      <Heading size="small">{virksomhetsnavn}</Heading>
      <p>
        Mottatt:{" "}
        {restdatoTilLesbarDato(oppfolgingsplanLPSBistandsbehov.opprettet)}
      </p>
      <Tag variant="info" className="mb-4">
        LPS
      </Tag>
      <div className="mb-4">
        <OpenPlanButton oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov} />
      </div>
      <BehandleOppfolgingsplanLPS
        oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov}
      />
    </Box>
  );
}
