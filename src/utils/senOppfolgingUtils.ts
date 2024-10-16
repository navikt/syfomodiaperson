import { SenOppfolgingKandidatResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { addDays, dagerMellomDatoerUtenAbs } from "@/utils/datoUtils";

export const isVarselUbesvart = (
  kandidat: SenOppfolgingKandidatResponseDTO
): boolean => {
  const { svar, varselAt } = kandidat;
  if (!svar && !!varselAt) {
    return (
      dagerMellomDatoerUtenAbs(getVarselSvarfrist(varselAt), new Date()) >= 0
    );
  } else {
    return false;
  }
};

export const getVarselSvarfrist = (varselAt: Date) => addDays(varselAt, 10);
