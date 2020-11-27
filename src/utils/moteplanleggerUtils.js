import { BRUKER, MULIGE_SVAR } from "../konstanter";

export const brukerHarSvart = (svartidspunkt, created) => {
  if (!svartidspunkt) {
    return false;
  }
  return new Date(svartidspunkt) > new Date(created);
};

export const getSvar = ({ valgt, created }, svartidspunkt) => {
  if (!brukerHarSvart(svartidspunkt, created)) {
    return MULIGE_SVAR.IKKE_SVART;
  }
  return valgt ? MULIGE_SVAR.PASSER : MULIGE_SVAR.PASSER_IKKE;
};

export const getTidligereAlternativer = (mote, deltakertype = BRUKER) => {
  const innloggetBruker = mote.deltakere.filter((deltaker) => {
    return deltaker.type === deltakertype;
  })[0];
  return mote.alternativer.filter((alternativ) => {
    return alternativ.created < innloggetBruker.svartidspunkt;
  });
};
