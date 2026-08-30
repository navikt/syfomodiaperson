import {
  Periode,
  antallDagerIPeriode as antallDagerIPeriode,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";

export function tilLesbarPeriodeDatoerOgDager(periode: Periode) {
  const startOgSluttDato = tilLesbarPeriodeMedArUtenManednavn(
    periode.fom,
    periode.tom,
  );
  const antallDager = antallDagerIPeriode(periode);

  return `${startOgSluttDato} (${antallDager} dager)`;
}
