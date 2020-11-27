import { Prediksjon } from "../reducers/prediksjon";

export const HENT_PREDIKSJON_FEILET = "HENT_PREDIKSJON_FEILET";
export const HENT_PREDIKSJON_HENTER = "HENT_PREDIKSJON_HENTER";
export const HENT_PREDIKSJON_FORESPURT = "HENT_SYKMELDINGER_FORESPURT";
export const HENT_PREDIKSJON_HENTET = "HENT_PREDIKSJON_HENTET";

export const hentPrediksjonFeilet = () => ({ type: HENT_PREDIKSJON_FEILET });
export const hentPrediksjonHenter = () => ({ type: HENT_PREDIKSJON_HENTER });
export const hentPrediksjon = (fnr: string) => ({
  type: HENT_PREDIKSJON_FORESPURT,
  fnr,
});
export const hentPrediksjonHentet = (data: Prediksjon, fnr: string) => ({
  type: HENT_PREDIKSJON_HENTET,
  data,
  fnr,
});
