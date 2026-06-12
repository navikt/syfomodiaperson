import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../common/mockConstants";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { ArbeidsforholdPersonDTO } from "@/data/arbeidsforhold/ArbeidsforholdDTO";
import { daysFromToday, weeksFromToday } from "@/utils/datoUtils.ts";

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

export const arbeidsforholdPersonMock: ArbeidsforholdPersonDTO = {
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  arbeidsforhold: [
    {
      navArbeidsforholdId: 1,
      opprettet: "2020-01-01T00:00:00",
      sistBekreftet: "2024-01-01T00:00:00",
      orgnummer: "333666999",
      type: "Ordinært arbeidsforhold",
      ansettelseStart: "2020-01-01",
      ansettelseSlutt: null,
      ansettelsesform: "Fast ansettelse",
      yrke: "Sykepleier",
      stillingsprosent: "80",
    },
    {
      navArbeidsforholdId: 1,
      opprettet: "2020-01-01T00:00:00",
      sistBekreftet: "2024-01-01T00:00:00",
      orgnummer: "110110110",
      type: "Ordinært arbeidsforhold",
      ansettelseStart: "2020-01-01",
      ansettelseSlutt: null,
      ansettelsesform: "Fast ansettelse",
      yrke: "Brannmann",
      stillingsprosent: "40",
    },
    {
      navArbeidsforholdId: 1,
      opprettet: "2020-01-01T00:00:00",
      sistBekreftet: "2024-01-01T00:00:00",
      orgnummer: "000000001",
      type: "Ordinært arbeidsforhold",
      ansettelseStart: "2020-01-01",
      ansettelseSlutt: "2022-02-02",
      ansettelsesform: "Fast ansettelse",
      yrke: "Medarbeider",
      stillingsprosent: "100",
    },
  ],
};

export const diskresjonskodeMock: "6" | "7" | "" = "";

export const isEgenansattMock = false;

export const maksdato = weeksFromToday(13);

export const maksdatoMock = {
  maxDate: {
    id: "123",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    forelopig_beregnet_slutt: maksdato,
    utbetalt_tom: weeksFromToday(-2),
    tom: daysFromToday(-3),
    gjenstaende_sykedager: "70",
    opprettet: Date.now().toString(),
  },
};
