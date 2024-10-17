import { SenOppfolgingKandidatResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { addDays, dagerMellomDatoerUtenAbs } from "@/utils/datoUtils";

export function isVarselUbesvart(
  kandidat: SenOppfolgingKandidatResponseDTO
): boolean {
  const { svar, varselAt } = kandidat;
  if (!svar && !!varselAt) {
    return (
      dagerMellomDatoerUtenAbs(getVarselSvarfrist(varselAt), new Date()) >= 0
    );
  } else {
    return false;
  }
}

export function getVarselSvarfrist(varselAt: Date) {
  return addDays(varselAt, 10);
}
