import { StatusEndring, StoppAutomatikk } from "../types/FlaggPerson";

export const HENT_STATUS_FEILET = "HENT_STATUS_FEILET";
export const HENTER_STATUS = "HENTER_STATUS";
export const HENT_STATUS_FORESPURT = "HENT_SYKMELDINGER_FORESPURT";
export const STATUS_HENTET = "STATUS_HENTET";

export const ENDRE_STATUS_FORESPURT = "ENDRE_STATUS_FORESPURT";
export const ENDRER_STATUS = "ENDRER_STATUS";
export const ENDRE_STATUS_FEILET = "ENDRE_STATUS_FEILET";
export const STATUS_ENDRET = "STATUS_ENDRET";

export const hentStatusFeilet = () => ({ type: HENT_STATUS_FEILET });
export const henterStatus = () => ({ type: HENTER_STATUS });
export const hentStatus = (fnr: string) => ({
  type: HENT_STATUS_FORESPURT,
  fnr,
});
export const statusHentet = (data: StatusEndring[], fnr: string) => ({
  type: STATUS_HENTET,
  data,
  fnr,
});

export const endreStatus = (stoppAutomatikk: StoppAutomatikk) => ({
  type: ENDRE_STATUS_FORESPURT,
  stoppAutomatikk,
});
export const endrerStatus = () => ({ type: ENDRER_STATUS });
export const endreStatusFeilet = () => ({ type: ENDRE_STATUS_FEILET });
export const statusEndret = () => ({ type: STATUS_ENDRET });
