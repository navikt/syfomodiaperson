export const formaterOrgnr = (orgnr: string) => {
  return orgnr ? orgnr.replace(/(...)(...)(...)/g, "$1 $2 $3") : null;
};

export const tilStorForbokstav = (streng: string) => {
  return streng.replace(/^\w/, (c) => {
    return c.toUpperCase();
  });
};
