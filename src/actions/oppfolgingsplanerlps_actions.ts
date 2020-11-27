import { OppfolgingsplanLPS } from "../types/OppfolgingsplanLPS";
import { PersonOppgave } from "../types/PersonOppgave";

export const HENT_OPPFOLGINGSPLANER_LPS_FORESPURT =
  "HENT_OPPFOLGINGSPLANER_LPS_FORESPURT";
export const HENT_OPPFOLGINGSPLANER_LPS_HENTER =
  "HENT_OPPFOLGINGSPLANER_LPS_HENTER";
export const HENT_OPPFOLGINGSPLANER_LPS_HENTET =
  "HENT_OPPFOLGINGSPLANER_LPS_HENTET";
export const HENT_OPPFOLGINGSPLANER_LPS_FEILET =
  "HENT_OPPFOLGINGSPLANER_LPS_FEILET";

export const hentOppfolgingsplanerLPS = (fnr: string) => ({
  type: HENT_OPPFOLGINGSPLANER_LPS_FORESPURT,
  fnr,
});

export const hentOppfolgingsplanerLPSHenter = () => ({
  type: HENT_OPPFOLGINGSPLANER_LPS_HENTER,
});

export const hentOppfolgingsplanerLPSHentet = (
  data: OppfolgingsplanLPS[],
  personOppgaveList: PersonOppgave[]
) => ({
  type: HENT_OPPFOLGINGSPLANER_LPS_HENTET,
  data,
  personOppgaveList,
});

export const hentOppfolgingsplanerLPSFeilet = () => ({
  type: HENT_OPPFOLGINGSPLANER_LPS_FEILET,
});
