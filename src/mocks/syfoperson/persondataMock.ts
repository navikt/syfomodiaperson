import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../common/mockConstants";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { weeksFromToday } from "../../../test/testUtils";

export const kontaktinformasjonMock = {
  epost: ARBEIDSTAKER_DEFAULT.epost,
  tlf: "99887766",
  skalHaVarsel: true,
};

export const brukerinfoMock: BrukerinfoDTO = {
  aktivPersonident: ARBEIDSTAKER_DEFAULT.personIdent,
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  arbeidssituasjon: "ARBEIDSTAKER",
  dodsdato: null,
  kjonn: "MANN",
  fodselsdato: "1969-02-19",
  alder: 56,
  tilrettelagtKommunikasjon: null,
  sikkerhetstiltak: [],
};

export const diskresjonskodeMock: "6" | "7" | "" = "";

export const isEgenansattMock = false;

export const maksdato = weeksFromToday(13);

export const maksdatoMock = {
  maxDate: {
    id: "123",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    forelopig_beregnet_slutt: maksdato,
    utbetalt_tom: "2024-07-01",
    gjenstaende_sykedager: "70",
    opprettet: Date.now().toString(),
  },
};
