export const lagNummer = (streng) => {
  return streng.replace(/[^\d.-]/g, "").replace(/-/g, "");
};

export const formaterTid = (input) => {
  const grupper = lagNummer(input).split(".");
  const tid = grupper.join("");
  if (tid.length > 2 || grupper.length > 1) {
    return tid.replace(/(.{2})/, "$1.");
  }
  return tid;
};

export const Vis = ({ hvis, children, render }) => {
  return hvis && render ? render() : hvis && children ? children : null;
};

export const formaterOrgnr = (orgnr) => {
  return orgnr ? orgnr.replace(/(...)(...)(...)/g, "$1 $2 $3") : null;
};

export const tilStorForbokstav = (streng) => {
  return streng.replace(/^\w/, (c) => {
    return c.toUpperCase();
  });
};
