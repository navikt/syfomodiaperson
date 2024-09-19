import { Button, HStack } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import {
  manglendeMedvirkningIkkeAktuellPath,
  manglendeMedvirkningOppfyltPath,
  manglendeMedvirkningStansPath,
  manglendeMedvirkningUnntakPath,
} from "@/routers/AppRouter";
import React from "react";

const texts = {
  stans: "Innstilling om stans",
  oppfylt: "Oppfylt",
  unntak: "Unntak",
  ikkeAktuell: "Ikke aktuell",
};

interface Props {
  isBeforeForhandsvarselDeadline: boolean;
}

export const ManglendeMedvirkningButtons = ({
  isBeforeForhandsvarselDeadline,
}: Props) => (
  <HStack gap="4">
    {isBeforeForhandsvarselDeadline ? (
      <Button variant="primary" disabled>
        {texts.stans}
      </Button>
    ) : (
      <Button as={Link} to={manglendeMedvirkningStansPath} variant="primary">
        {texts.stans}
      </Button>
    )}
    <Button as={Link} to={manglendeMedvirkningOppfyltPath} variant="secondary">
      {texts.oppfylt}
    </Button>
    <Button as={Link} to={manglendeMedvirkningUnntakPath} variant="secondary">
      {texts.unntak}
    </Button>
    <Button
      as={Link}
      to={manglendeMedvirkningIkkeAktuellPath}
      variant="secondary"
    >
      {texts.ikkeAktuell}
    </Button>
  </HStack>
);
