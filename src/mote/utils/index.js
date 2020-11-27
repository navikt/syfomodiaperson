export const pad = (nr) => {
  return nr > 9 || nr.length > 1 ? nr : `0${nr}`;
};

export const getDatoFraZulu = (zulutid) => {
  const d = new Date(zulutid);
  const dag = pad(d.getDate());
  const maned = pad(d.getMonth() + 1);
  return `${dag}.${maned}.${d.getFullYear()}`;
};

export function genererDato(dato, klokkeslett) {
  const s = new Date();
  s.setDate(1);

  const datoArr = dato.split(".");
  const klokkeslettArr = klokkeslett.split(".");
  const aar = datoArr[2];
  const aarPadded = aar.length === 2 ? `20${aar}` : aar;
  s.setYear(aarPadded);
  s.setMonth(parseInt(datoArr[1], 10) - 1);
  s.setDate(datoArr[0]);
  s.setUTCHours(klokkeslettArr[0]);
  s.setMinutes(klokkeslettArr[1]);
  s.setSeconds("00");
  return s.toJSON().slice(0, -5);
}

export function erGyldigKlokkeslett(klokkeslett) {
  const re = /^([0-9]|0[0-9]|1[0-9]|2[0-3])\.[0-5][0-9]$/;
  return re.test(klokkeslett);
}

export function erGyldigDato(dato) {
  // eslint-disable-next-line max-len
  const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  return re.test(dato);
}

export const erAlleAlternativerPassert = (alternativer) => {
  const midnatt = new Date();
  midnatt.setHours(0, 0, 0);
  return (
    alternativer.filter((alternativ) => {
      return alternativ.tid > midnatt;
    }).length === 0
  );
};

export const newDate = () => {
  const now = new Date();
  return new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
};

export const erMotePassert = (mote) => {
  if (mote.bekreftetAlternativ && mote.bekreftetAlternativ.tid <= newDate()) {
    return true;
  }
  const antallAlternativer = mote.alternativer.length;
  return (
    mote.alternativer.filter((alternativ) => {
      return alternativ.tid <= newDate();
    }).length === antallAlternativer
  );
};

export const trekkDagerFraDato = (dato, dager) => {
  return new Date().setTime(dato.getTime() - dager * 86400000);
};
export const leggTilDagerPaaDato = (dato, dager) => {
  return new Date().setTime(dato.getTime() + dager * 86400000);
};
