import React, { ReactElement } from "react";
import { Label } from "@navikt/ds-react";

interface Props {
  children?: string;
}

export default function OppsummeringSporsmalstekst({
  children,
}: Props): ReactElement {
  return (
    <Label size="small" className="mt-2">
      {children}
    </Label>
  );
}
