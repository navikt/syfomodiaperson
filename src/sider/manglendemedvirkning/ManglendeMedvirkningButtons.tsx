import { Button, HStack } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import React from "react";

const texts = {
  stans: "Skriv innstilling om stans",
  oppfylt: "Oppfylt",
  unntak: "Unntak",
  ikkeAktuell: "Ikke aktuell",
};

interface Props {
  isBeforeForhandsvarselDeadline: boolean;
}

export default function ManglendeMedvirkningButtons({
  isBeforeForhandsvarselDeadline,
}: Props) {
  return (
    <HStack gap="4">
      {isBeforeForhandsvarselDeadline ? (
        <Button variant="primary" disabled>
          {texts.stans}
        </Button>
      ) : (
        <Button
          as={Link}
          to={`${manglendeMedvirkningPath}/stans`}
          variant="primary"
        >
          {texts.stans}
        </Button>
      )}
      <Button
        as={Link}
        to={`${manglendeMedvirkningPath}/oppfylt`}
        variant="secondary"
      >
        {texts.oppfylt}
      </Button>
      <Button
        as={Link}
        to={`${manglendeMedvirkningPath}/unntak`}
        variant="secondary"
      >
        {texts.unntak}
      </Button>
      <Button
        as={Link}
        to={`${manglendeMedvirkningPath}/ikkeaktuell`}
        variant="secondary"
      >
        {texts.ikkeAktuell}
      </Button>
    </HStack>
  );
}
