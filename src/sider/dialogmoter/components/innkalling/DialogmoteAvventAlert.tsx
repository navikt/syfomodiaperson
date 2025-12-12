import React from "react";
import { Alert, BodyShort, Heading } from "@navikt/ds-react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export interface DialogmoteAvventDTO {
  frist?: Date;
  tekst: string;
}

interface Props {
  avvent: DialogmoteAvventDTO;
}

const texts = {
  avventerTil: "Avventer",
};

export function DialogmoteAvventAlert({ avvent }: Props) {
  const { frist, tekst } = avvent;

  const tittel = frist
    ? `${texts.avventerTil} ${tilDatoMedManedNavn(frist)}`
    : texts.avventerTil;

  return (
    <Alert variant="warning" size="small" className="mb-4">
      <Heading size="xsmall" level="3" spacing>
        {tittel}
      </Heading>
      <BodyShort size="small">{tekst}</BodyShort>
    </Alert>
  );
}
