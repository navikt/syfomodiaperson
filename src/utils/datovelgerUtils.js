const parseDato = (dato) => {
  const datoSplit = dato.split(".");
  let ar = datoSplit[2];
  if (ar.length === 2) {
    ar = `20${ar}`;
  }
  return `${ar}-${datoSplit[1]}-${datoSplit[0]}`;
};

export const fraInputdatoTilJSDato = (inputDato) => {
  const d = parseDato(inputDato);
  return new Date(d);
};

export const erGyldigDatoformat = (dato) => {
  const d = dato.replace(/\./g, "");
  let s = `${parseInt(d, 10)}`;
  if (dato.startsWith("0")) {
    s = `0${s}`;
  }
  if (dato.trim().length !== 10) {
    return false;
  }
  if (s.length !== 8) {
    return false;
  }
  return true;
};

export const erGyldigDato = (dato) => {
  // eslint-disable-next-line max-len
  const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  if (!re.test(dato)) {
    return false;
  }
  return erGyldigDatoformat(dato);
};
