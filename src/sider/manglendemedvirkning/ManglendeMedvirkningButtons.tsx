import { Button, HStack } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import {
  manglendeMedvirkningIkkeAktuellPath,
  manglendeMedvirkningOppfyltPath,
  manglendeMedvirkningStansPath,
} from "@/routers/AppRouter";
import React from "react";

const texts = {
  avslag: "Innstilling om stans",
  oppfylt: "Oppfylt",
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
        {texts.avslag}
      </Button>
    ) : (
      <Button as={Link} to={manglendeMedvirkningStansPath} variant="primary">
        {texts.avslag}
      </Button>
    )}
    <Button as={Link} to={manglendeMedvirkningOppfyltPath} variant="secondary">
      {texts.oppfylt}
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
