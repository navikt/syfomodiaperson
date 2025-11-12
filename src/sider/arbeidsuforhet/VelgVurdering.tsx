import React from "react";
import { BodyShort, Box, Button, Heading, ReadMore } from "@navikt/ds-react";
import { useNavigate } from "react-router";
import { arbeidsuforhetPath } from "@/routers/AppRouter";

const texts = {
  title: "Registrer ny § 8-4 vurdering",
  description: "Her kan du starte en vilkårsvurdering av arbeidsuførhet.",
  forhandsvarselButton: "Forhåndsvarsel",
  innstillingUtenForhandsvarselButton: "Avslag uten forhåndsvarsel",
  narForhandsvarsel: "Når skal du sende forhåndsvarsel?",
  narForhandsvarselContent:
    "Du skal alltid sende forhåndsvarsel når sykepengene er utbetalt og vilkåret i § 8-4 ikke er oppfylt.",
  narAvslagUtenForhandsvarsel:
    "Når skal du skrive innstilling om avslag uten å sende forhåndsvarsel?",
  narAvslagUtenForhandsvarselContent:
    "Du skal ikke sende forhåndsvarsel når sykepengene ikke er utbetalt og vilkåret i § 8-4 ikke er oppfylt.",
  oppfyltButton: "Oppfylt",
};

export default function VelgVurdering() {
  const navigate = useNavigate();
  return (
    <Box background="surface-default" className="flex flex-col gap-4 p-6">
      <Heading level="2" size="medium">
        {texts.title}
      </Heading>
      <BodyShort>{texts.description}</BodyShort>
      <div>
        <ReadMore header={texts.narForhandsvarsel}>
          {texts.narForhandsvarselContent}
        </ReadMore>
        <ReadMore header={texts.narAvslagUtenForhandsvarsel} className="mb-2">
          {texts.narAvslagUtenForhandsvarselContent}
        </ReadMore>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          as="a"
          variant="primary"
          onClick={() => navigate(`${arbeidsuforhetPath}/forhandsvarsel`)}
        >
          {texts.forhandsvarselButton}
        </Button>
        <Button
          as="a"
          variant="secondary"
          onClick={() =>
            navigate(`${arbeidsuforhetPath}/innstilling-uten-forhandsvarsel`)
          }
        >
          {texts.innstillingUtenForhandsvarselButton}
        </Button>
        <Button
          as="a"
          variant="secondary"
          onClick={() => navigate(`${arbeidsuforhetPath}/oppfylt`)}
        >
          {texts.oppfyltButton}
        </Button>
      </div>
    </Box>
  );
}
