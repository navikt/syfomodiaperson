import React from "react";
import { BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { useNavigate } from "react-router";
import { arbeidsuforhetPath } from "@/routers/AppRouter";

const texts = {
  title: "Registrer ny vurdering",
  description: "Her kan du starte en vilkårsvurdering av arbeidsuførhet.",
  description2:
    'I de fleste saker der vilkåret ikke er oppfylt skal du sende et forhåndsvarsel. Kun dersom utbetaling ikke er igangsatt, eller NAY ber om en innstilling som en del av en større sammensatt vurdering, skal du velge "Innstilling uten forhåndsvarsel".',
  forhandsvarselButton: "Forhåndsvarsel",
  innstillingUtenForhandsvarselButton: "Innstilling uten forhåndsvarsel",
};

export default function VelgVurdering() {
  const navigate = useNavigate();
  return (
    <Box background="surface-default" padding="6">
      <Heading level="2" size="medium" className="mb-4">
        {texts.title}
      </Heading>
      <BodyShort className="mb-4">{texts.description}</BodyShort>
      <BodyShort className="mb-4">{texts.description2}</BodyShort>
      <Button
        as="a"
        variant="primary"
        onClick={() => navigate(`${arbeidsuforhetPath}/forhandsvarsel`)}
        className="mr-2"
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
    </Box>
  );
}
