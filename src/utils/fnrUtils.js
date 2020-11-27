import { KJOENN } from "../konstanter";

export const hentBrukersFoedseldatoFraFnr = (fnr) => {
  const individSifre = Number(fnr.substring(6, 9));

  const dag = Number(fnr.substring(0, 2));
  const foedselsDag = dag > 40 ? dag - 40 : dag;

  const mnd = Number(fnr.substring(2, 4));
  const foedselsMnd = mnd > 40 ? mnd - 40 : mnd;

  const aar = Number(fnr.substring(4, 6));
  let aarhundre;
  if (individSifre >= 0 && individSifre <= 499) {
    aarhundre = 19;
  } else if (individSifre >= 500 && individSifre <= 749 && aar > 55) {
    aarhundre = 18;
  } else if (individSifre >= 500 && individSifre <= 999 && aar <= 39) {
    aarhundre = 20;
  } else if (individSifre >= 900 && individSifre <= 999 && aar >= 40) {
    aarhundre = 19;
  } else {
    return undefined;
  }
  const foedselsAar = aarhundre * 100 + aar;
  const foedselsdato = new Date();
  foedselsdato.setUTCDate(foedselsDag);
  foedselsdato.setUTCMonth(foedselsMnd - 1);
  foedselsdato.setUTCFullYear(foedselsAar);
  foedselsdato.setUTCHours(0, 0, 0, 0);
  return foedselsdato;
};

export const hentBrukersAlderFraFnr = (fnr) => {
  const dagensDato = new Date();
  const foedselsdato = hentBrukersFoedseldatoFraFnr(fnr);

  const foedselsDatoIAar = new Date(foedselsdato);
  foedselsDatoIAar.setFullYear(dagensDato.getFullYear());
  if (foedselsdato && dagensDato.getTime() < foedselsDatoIAar.getTime()) {
    return dagensDato.getFullYear() - foedselsdato.getFullYear() - 1;
  }
  return foedselsdato && dagensDato.getFullYear() - foedselsdato.getFullYear();
};

export const hentBrukersKjoennFraFnr = (fnr) => {
  const kjoennSiffer = Number(fnr.substring(8, 9));
  if (kjoennSiffer % 2 === 0) {
    return KJOENN.KVINNE;
  }
  return KJOENN.MANN;
};

export const formaterFnr = (fnr) => {
  return fnr ? fnr.replace(/(......)(.....)/g, "$1 $2") : null;
};
