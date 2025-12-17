import React from "react";
import { Alert, BodyShort, Label } from "@navikt/ds-react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export interface DialogmoteAvventDTO {
  frist?: string;
  tekst: string;
}

interface Props {
  avvent: DialogmoteAvventDTO;
}

export function DialogmoteAvventAlert({ avvent }: Props) {
  const { frist, tekst } = avvent;

  return (
    <Alert variant="warning" size="small" className="mb-4">
      <Label size="small">
        {frist
          ? `Avventer til ${tilDatoMedManedNavn(new Date(frist))}`
          : "Avventer"}
      </Label>
      <BodyShort size="small">{tekst}</BodyShort>
    </Alert>
  );
}
