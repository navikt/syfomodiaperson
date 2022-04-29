import {
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";

export const historikkmoterMock = [
  {
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tekst: `${VEILEDER_IDENT_DEFAULT} opprettet møte med ${ARBEIDSTAKER_DEFAULT_FULL_NAME} og Station Officer Steele`,
    tidspunkt: "2019-04-04T10:38:53.361",
  },
  {
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tekst: `${VEILEDER_IDENT_DEFAULT} opprettet møte med ${ARBEIDSTAKER_DEFAULT_FULL_NAME} og Station Officer Steele`,
    tidspunkt: "2019-03-27T09:05:43.116",
  },
  {
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tekst: `${VEILEDER_IDENT_DEFAULT} avbrøt møteforespørselen`,
    tidspunkt: "2019-02-15T09:04:38",
  },
  {
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    tekst: `${VEILEDER_IDENT_DEFAULT} bekreftet møteforespørselen`,
    tidspunkt: "2019-01-05T09:04:30",
  },
];
