import { HENT_LEDERE_FORESPURT } from "./actiontyper";

export const hentLedere = (fnr) => {
  return {
    type: HENT_LEDERE_FORESPURT,
    fnr,
  };
};
