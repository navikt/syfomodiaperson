import React from "react";
import { Checkbox } from "nav-frontend-skjema";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";

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
      <Checkbox
        className="sykmeldingMotebehovVisning__checkbox"
        label={checkboxLabel}
        checked
        disabled
      />
      <h6 className="sporsmal">{sporsmal}</h6>
      <p>{tilLesbarDatoMedArstall(returDato)}</p>
    </div>
  );
}
