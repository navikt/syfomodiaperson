import {
  Periode,
  antallDagerIPeriode,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import React from "react";

export function PeriodeOgAntallDagerTekst({ periode }: { periode: Periode }) {
  const startOgSluttDato = tilLesbarPeriodeMedArUtenManednavn(
    periode.fom,
    periode.tom,
  );
  const antallDager = antallDagerIPeriode(periode);

  return (
    <>
      <span>{startOgSluttDato}</span> <span>({antallDager}&nbsp;dager)</span>
    </>
  );
}
