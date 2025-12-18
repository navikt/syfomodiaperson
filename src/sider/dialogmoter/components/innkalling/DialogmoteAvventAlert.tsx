import React from "react";
import { Alert, BodyShort, Label } from "@navikt/ds-react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { AvventDTO } from "@/data/dialogmotekandidat/dialogmotekandidatTypes";

interface Props {
  avvent: AvventDTO;
}

const texts = {
  avventerTil: "Avventer til",
};

export function DialogmoteAvventAlert({ avvent }: Props) {
  return (
    <Alert variant="warning" size="small" className="mb-4">
      <Label size="small">
        {avvent.frist
          ? `${texts.avventerTil} ${tilDatoMedManedNavn(
              new Date(avvent.frist)
            )}`
          : "Avventer"}
      </Label>
      <BodyShort size="small">{avvent.beskrivelse}</BodyShort>
    </Alert>
  );
}
