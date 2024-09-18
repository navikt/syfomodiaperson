export const erProd = () => {
  return window.location.href.indexOf("syfomodiaperson.intern.nav.no") > -1;
};

export const erDev = () => {
  return (
    window.location.href.indexOf("syfomodiaperson.intern.dev.nav.no") > -1 ||
    erAnsattDev()
  );
};

export const erAnsattDev = (): boolean => {
  return window.location.href.indexOf("ansatt.dev.nav.no") > -1;
};

export const finnMiljoStreng = () => {
  return erDev() ? "-q1" : "";
};

export const erLokal = (): boolean => {
  return window.location.host.indexOf("localhost") > -1;
};

export const finnNaisUrlIntern = () => {
  if (erAnsattDev()) {
    return ".ansatt.dev.nav.no";
  } else if (erDev()) {
    return ".intern.dev.nav.no";
  } else {
    return ".intern.nav.no";
  }
};

export const fullNaisUrlIntern = (host: string, path = "") => {
  if (erLokal()) {
    return path;
  }
  return `https://${host}${finnNaisUrlIntern()}${path}`;
};
