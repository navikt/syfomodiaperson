import { Alert, Heading } from "@navikt/ds-react";
import React from "react";
import { TildeltNotification } from "@/components/tildele/oppfolgingsenhet/Oppfolgingsenhet";

interface Props {
  tildeltNotification: TildeltNotification;
}

export default function TildeltOppfolgingsenhetAlert({
  tildeltNotification,
}: Props) {
  return (
    <Alert variant={tildeltNotification.variant} className="mb-2">
      {!!tildeltNotification.header && (
        <Heading size="xsmall" level="3">
          {tildeltNotification.header}
        </Heading>
      )}
      {tildeltNotification.message}
    </Alert>
  );
}
