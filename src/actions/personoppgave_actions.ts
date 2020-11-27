import { PersonOppgave } from "../types/PersonOppgave";

export const HENT_PERSONOPPGAVER_FORESPURT = "HENT_PERSONOPPGAVER_FORESPURT";
export const HENT_PERSONOPPGAVER_HENTER = "HENT_PERSONOPPGAVER_HENTER";
export const HENT_PERSONOPPGAVER_HENTET = "HENT_PERSONOPPGAVER_HENTET";
export const HENT_PERSONOPPGAVER_FEILET = "HENT_PERSONOPPGAVER_FEILET";

export const BEHANDLE_PERSONOPPGAVE_FORESPURT =
  "BEHANDLE_PERSONOPPGAVE_FORESPURT";
export const BEHANDLE_PERSONOPPGAVE_BEHANDLER =
  "BEHANDLE_PERSONOPPGAVE_BEHANDLER";
export const BEHANDLE_PERSONOPPGAVE_BEHANDLET =
  "BEHANDLE_PERSONOPPGAVE_BEHANDLET";
export const BEHANDLE_PERSONOPPGAVE_FEILET = "BEHANDLE_PERSONOPPGAVE_FEILET";

export const hentPersonOppgaver = (fnr: string) => ({
  type: HENT_PERSONOPPGAVER_FORESPURT,
  fnr,
});

export const hentPersonOppgaverHenter = () => ({
  type: HENT_PERSONOPPGAVER_HENTER,
});

export const hentPersonOppgaverHentet = (data: PersonOppgave[]) => ({
  type: HENT_PERSONOPPGAVER_HENTET,
  data,
});

export const hentPersonOppgaverFeilet = () => ({
  type: HENT_PERSONOPPGAVER_FEILET,
});

export const behandlePersonOppgave = (
  uuid: string,
  referanseUuid: string,
  veilederIdent: string
) => ({
  type: BEHANDLE_PERSONOPPGAVE_FORESPURT,
  uuid,
  referanseUuid,
  veilederIdent,
});

export const behandlePersonOppgaveBehandler = () => ({
  type: BEHANDLE_PERSONOPPGAVE_BEHANDLER,
});

export const behandlePersonOppgaveBehandlet = (
  uuid: string,
  referanseUuid: string,
  veilederIdent: string
) => ({
  type: BEHANDLE_PERSONOPPGAVE_BEHANDLET,
  uuid,
  referanseUuid,
  veilederIdent,
});

export const behandlePersonOppgaveFeilet = () => ({
  type: BEHANDLE_PERSONOPPGAVE_FEILET,
});
