import { BrukerinfoDTO } from "./types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

export const useNavBrukerData = (): BrukerinfoDTO & {
  brukerKanIkkeVarslesDigitalt: boolean;
  brukerKanVarslesDigitalt: boolean;
} => {
  const brukerinfo: BrukerinfoDTO = useBrukerinfoQuery().brukerinfo;
  return {
    brukerKanIkkeVarslesDigitalt:
      brukerinfo?.kontaktinfo?.reservasjon?.skalHaVarsel === false,
    brukerKanVarslesDigitalt:
      brukerinfo.kontaktinfo?.reservasjon?.skalHaVarsel === true,
    ...brukerinfo,
  };
};
