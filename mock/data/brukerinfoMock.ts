import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";

export const brukerinfoMock = {
  navn: 'Samuel "Sam" Jones',
  kontaktinfo: {
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    epost: "samuel@pontypandyfire.gov.uk",
    tlf: "99887766",
    skalHaVarsel: true,
  },
  arbeidssituasjon: "ARBEIDSTAKER",
};
