import { HENT_NAVBRUKER_FORESPURT } from "./actiontyper";

export function hentNavbruker(fnr) {
  return {
    type: HENT_NAVBRUKER_FORESPURT,
    fnr,
  };
}
