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
  const datoArr = dato.split("-");
  const klokkeslettArr = klokkeslett.split(":");
  const aar = datoArr[0];
  const aarPadded = aar.length === 2 ? `20${aar}` : aar;
  s.setYear(aarPadded);
  s.setMonth(parseInt(datoArr[1], 10) - 1);
  s.setDate(datoArr[2]);
  s.setUTCHours(klokkeslettArr[0]);
  s.setMinutes(klokkeslettArr[1]);
  s.setSeconds("00");
  return s.toJSON().slice(0, -5);
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
