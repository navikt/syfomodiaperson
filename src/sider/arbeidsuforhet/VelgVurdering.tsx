import React from "react";
import { BodyShort, Box, Button, Heading, ReadMore } from "@navikt/ds-react";
import { useNavigate } from "react-router";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

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

function logReadMore(tekst: string) {
  Amplitude.logEvent({
    type: EventType.AccordionOpen,
    data: {
      url: window.location.href,
      tekst: `Åpnet ${tekst} for å lese mer`,
    },
  });
}

export default function VelgVurdering() {
  const navigate = useNavigate();
  const { toggles } = useFeatureToggles();
  return (
    <Box background="surface-default" padding="6">
      <Heading level="2" size="medium" className="mb-4">
        {texts.title}
      </Heading>
      {toggles.isInnstillingUtenForhandsvarselArbeidsuforhetEnabled ? (
        <>
          <ReadMore
            header={texts.narForhandsvarsel}
            onOpenChange={(open) => {
              if (open) {
                logReadMore("sende forhåndsvarsel");
              }
            }}
          >
            {texts.narForhandsvarselContent}
          </ReadMore>
          <ReadMore
            header={texts.narAvslagUtenForhandsvarsel}
            onOpenChange={(open) => {
              if (open) {
                logReadMore("avslag uten forhåndsvarsel");
              }
            }}
            className="mb-2"
          >
            {texts.narAvslagUtenForhandsvarselContent}
          </ReadMore>
        </>
      ) : (
        <BodyShort className="mb-4">{texts.description}</BodyShort>
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
