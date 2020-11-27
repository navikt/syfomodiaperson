import { VedtakDTO } from "../reducers/vedtak";

export const HENT_VEDTAK_FEILET = "HENT_VEDTAK_FEILET";
export const HENT_VEDTAK_HENTER = "HENT_VEDTAK_HENTER";
export const HENT_VEDTAK_FORESPURT = "HENT_VEDTAK_FORESPURT";
export const HENT_VEDTAK_HENTET = "HENT_VEDTAK_HENTET";

export const hentVedtakFeilet = () => ({ type: HENT_VEDTAK_FEILET });
export const hentVedtakHenter = () => ({ type: HENT_VEDTAK_HENTER });
export const hentVedtak = (fnr: string) => ({
  type: HENT_VEDTAK_FORESPURT,
  fnr,
});
export const hentVedtakHentet = (data: VedtakDTO, fnr: string) => ({
  type: HENT_VEDTAK_HENTET,
  data,
  fnr,
});
