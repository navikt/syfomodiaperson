import React from "react";
import { BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { useNavigate } from "react-router";
import { arbeidsuforhetPath } from "@/routers/AppRouter";

const texts = {
  title: "Registrer ny vurdering",
  description:
    "Her kan du starte eller fortsette en vurdering av arbeidsuførhet.",
  forhandsvarselButton: "Forhåndsvarsel",
  innstillingUtenForhandsvarselButton: "Innstilling uten forhåndsvarsel",
};

export default function AktivVurdering() {
  const navigate = useNavigate();
  return (
    <Box background="surface-default" padding="6">
      <Heading level="2" size="medium" className="mb-4">
        {texts.title}
      </Heading>
      <BodyShort className="mb-4">{texts.description}</BodyShort>
      <Button
        variant="primary"
        onClick={() => navigate(`${arbeidsuforhetPath}/forhandsvarsel`)}
        className="mr-2"
      >
        {texts.forhandsvarselButton}
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          navigate(`${arbeidsuforhetPath}/innstilling-uten-forhandsvarsel`)
        }
      >
        {texts.innstillingUtenForhandsvarselButton}
      </Button>
    </Box>
  );
}
