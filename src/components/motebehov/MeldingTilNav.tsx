import React from "react";
import { BodyLong, BodyShort, Checkbox } from "@navikt/ds-react";

const tekster = {
  meldingTilNav: "Melding til Nav",
  navBoerTaTakISaken: {
    tittel: "Ønskes bistand fra Nav nå?",
    begrunnelseTittel: "Begrunn nærmere",
  },
};

interface Props {
  meldingTilNav: {
    navBoerTaTakISaken?: boolean;
    navBoerTaTakISakenBegrunnelse?: string;
  };
}

export function MeldingTilNav({ meldingTilNav }: Props) {
  return (
    <div className="mt-4">
      <BodyShort size="small" weight="semibold">
        {tekster.meldingTilNav}
      </BodyShort>

      <Checkbox
        size="small"
        checked={meldingTilNav.navBoerTaTakISaken}
        readOnly
      >
        {tekster.navBoerTaTakISaken.tittel}
      </Checkbox>
      {meldingTilNav.navBoerTaTakISakenBegrunnelse && (
        <>
          <BodyShort size="small" weight="semibold">
            {tekster.navBoerTaTakISaken.begrunnelseTittel}
          </BodyShort>
          <BodyLong size="small">
            {meldingTilNav.navBoerTaTakISakenBegrunnelse}
          </BodyLong>
        </>
      )}
    </div>
  );
}
