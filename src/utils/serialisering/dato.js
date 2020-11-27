export const tilDato = (datoStrenge) => {
  return datoStrenge && new Date(datoStrenge);
};

export const parseDatoerPeriode = (periode) => {
  return Object.assign({}, periode, {
    fom: new Date(periode.fom),
    tom: new Date(periode.tom),
  });
};

export const parseDatoerPeriodeListe = (perioder) => {
  return perioder.map((p) => {
    return parseDatoerPeriode(p);
  });
};
