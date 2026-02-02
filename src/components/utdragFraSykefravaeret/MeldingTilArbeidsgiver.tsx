import React from "react";
import { BodyLong, BodyShort } from "@navikt/ds-react";

const tekster = {
  header: "Melding til arbeidsgiver",
};

interface Props {
  innspillTilArbeidsgiver: string;
}

export function MeldingTilArbeidsgiver({ innspillTilArbeidsgiver }: Props) {
  return (
    <div className="mt-4">
      <BodyShort size="small" weight="semibold">
        {tekster.header}
      </BodyShort>
      <BodyLong size="small">{innspillTilArbeidsgiver}</BodyLong>
    </div>
  );
}
