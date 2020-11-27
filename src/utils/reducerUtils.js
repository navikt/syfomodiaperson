export const harForsoktHentetMotebehov = (motebehovReducer) => {
  return (
    motebehovReducer.hentet ||
    motebehovReducer.hentingFeilet ||
    (motebehovReducer.tilgang &&
      motebehovReducer.tilgang.harTilgang !== undefined)
  );
};

export const harForsoktHentetLedetekster = (ledeteksterReducer) => {
  return ledeteksterReducer.hentet || ledeteksterReducer.hentingFeilet;
};

export const harForsoktHentetLedere = (ledereReducer) => {
  return ledereReducer.hentet || ledereReducer.hentingFeilet;
};

export const harForsoktHentetOppfoelgingsdialoger = (
  oppfoelgingsdialogerReducer
) => {
  return (
    oppfoelgingsdialogerReducer.hentet ||
    oppfoelgingsdialogerReducer.hentingFeilet
  );
};

export const harForsoktHentetSoknader = (soknaderReducer) => {
  return soknaderReducer.hentet || soknaderReducer.hentingFeilet;
};

export const harForsoktHentetSykmeldinger = (sykmeldingerReducer) => {
  return sykmeldingerReducer.hentet || sykmeldingerReducer.hentingFeilet;
};
