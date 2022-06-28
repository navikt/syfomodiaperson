import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../common/mockConstants";

export const brukerinfoMock = {
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  kontaktinfo: {
    epost: ARBEIDSTAKER_DEFAULT.epost,
    tlf: "99887766",
    reservasjon: {
      skalHaVarsel: true,
      feilAarsak: null,
    },
  },
};
