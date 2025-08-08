import React from "react";
import { BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { useNavigate } from "react-router";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

const texts = {
  title: "Registrer ny vurdering",
  description: "Her kan du starte en vilkårsvurdering av arbeidsuførhet.",
  description2:
    'I de fleste saker der vilkåret ikke er oppfylt skal du sende et forhåndsvarsel. Kun dersom utbetaling ikke er igangsatt, eller NAY ber om en innstilling som en del av en større sammensatt vurdering, skal du velge "Avslag uten forhåndsvarsel".',
  forhandsvarselButton: "Forhåndsvarsel",
  innstillingUtenForhandsvarselButton: "Avslag uten forhåndsvarsel",
  oppfyltButton: "Oppfylt",
};

export default function VelgVurdering() {
  const navigate = useNavigate();
  const { toggles } = useFeatureToggles();
  return (
    <Box background="surface-default" padding="6">
      <Heading level="2" size="medium" className="mb-4">
        {texts.title}
      </Heading>
      <BodyShort className="mb-4">{texts.description}</BodyShort>
      {toggles.isInnstillingUtenForhandsvarselArbeidsuforhetEnabled && (
        <BodyShort className="mb-4">{texts.description2}</BodyShort>
      )}
      <div className="flex flex-row gap-4">
        <Button
          as="a"
          variant="primary"
          onClick={() => navigate(`${arbeidsuforhetPath}/forhandsvarsel`)}
        >
          {texts.forhandsvarselButton}
        </Button>
        {toggles.isInnstillingUtenForhandsvarselArbeidsuforhetEnabled && (
          <Button
            as="a"
            variant="secondary"
            onClick={() =>
              navigate(`${arbeidsuforhetPath}/innstilling-uten-forhandsvarsel`)
            }
          >
            {texts.innstillingUtenForhandsvarselButton}
          </Button>
        )}
        {toggles.isInnstillingUtenForhandsvarselArbeidsuforhetEnabled && (
          <Button
            as="a"
            variant="secondary"
            onClick={() => navigate(`${arbeidsuforhetPath}/oppfylt`)}
          >
            {texts.oppfyltButton}
          </Button>
        )}
      </div>
    </Box>
  );
}
