import { SenOppfolgingKandidatResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { addDays, dagerMellomDatoerUtenAbs } from "@/utils/datoUtils";

export function isVarselUbesvart(
  kandidat: SenOppfolgingKandidatResponseDTO
): boolean {
  const { svar, varselAt } = kandidat;
  return !svar && !!varselAt ? isVarselSvarfristUtlopt(varselAt) : false;
}

export function isVarselSvarfristUtlopt(varselAt: Date): boolean {
  return (
    dagerMellomDatoerUtenAbs(getVarselSvarfrist(varselAt), new Date()) >= 0
  );
}

export function getVarselSvarfrist(varselAt: Date): Date {
  return addDays(varselAt, 10);
}
