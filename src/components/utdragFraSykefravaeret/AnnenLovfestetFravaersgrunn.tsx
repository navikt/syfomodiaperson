import React from "react";
import { BodyShort } from "@navikt/ds-react";

const tekster = {
  tittel: "Annen lovfestet fraværsgrunn",
  beskrivFravaeret: "Beskriv fraværet",
};

interface Props {
  fravaersgrunn: string;
  fravaersBeskrivelse?: string;
}

export function AnnenLovfestetFravaersgrunn({
  fravaersgrunn,
  fravaersBeskrivelse,
}: Props) {
  return (
    <div>
      <BodyShort size="small" weight="semibold">
        {tekster.tittel}
      </BodyShort>
      <BodyShort size="small">{fravaersgrunn}</BodyShort>
      {fravaersBeskrivelse && (
        <>
          <BodyShort size="small" weight="semibold">
            {tekster.beskrivFravaeret}
          </BodyShort>
          <BodyShort size="small">{fravaersBeskrivelse}</BodyShort>
        </>
      )}
    </div>
  );
}
