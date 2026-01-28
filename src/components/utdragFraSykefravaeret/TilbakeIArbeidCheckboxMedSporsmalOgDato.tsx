import React from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { BodyShort, Checkbox } from "@navikt/ds-react";

interface Props {
  checkboxLabel: string;
  sporsmal: string;
  returDato?: Date;
}

export function TilbakeIArbeidCheckboxMedSporsmalOgDato({
  checkboxLabel,
  sporsmal,
  returDato,
}: Props) {
  return (
    <div>
      <Checkbox size="small" checked readOnly>
        {checkboxLabel}
      </Checkbox>
      <BodyShort size="small" weight="semibold">
        {sporsmal}
      </BodyShort>
      <BodyShort size="small">{tilLesbarDatoMedArstall(returDato)}</BodyShort>
    </div>
  );
}
