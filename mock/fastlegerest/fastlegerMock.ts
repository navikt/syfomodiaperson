import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
import { leggTilDagerPaDato } from "../util/dateUtil";
import { RelasjonKodeVerdi } from "./../../src/data/fastlege/types/Fastlege";

const fastlege = {
  fornavn: "Lege",
  mellomnavn: "",
  etternavn: "Legesen",
  fnr: "12035507971",
  herId: 711,
  helsepersonellregisterId: 2127598,
  pasient: {
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    fornavn: ARBEIDSTAKER_DEFAULT.navn.fornavn,
    mellomnavn: ARBEIDSTAKER_DEFAULT.navn.mellomnavn,
    etternavn: ARBEIDSTAKER_DEFAULT.navn.etternavn,
  },
  fastlegekontor: {
    navn: "PONTYPANDY LEGEKONTOR.",
    besoeksadresse: {
      adresse: "Branngata 2",
      postnummer: "1400",
      poststed: "Pontypandy",
    },
    postadresse: {
      adresse: "144",
      postnummer: "1400",
      poststed: "Pontypandy",
    },
    telefon: "12345678",
    epost: "pontypandy@edi.nhn.no",
    orgnummer: "000999000",
  },
  pasientforhold: {
    fom: "1993-03-01",
    tom: "9999-12-31",
  },
  gyldighet: {
    fom: "1993-03-01",
    tom: "9999-12-31",
  },
  relasjon: {
    kodeVerdi: RelasjonKodeVerdi.FASTLEGE,
    kodeTekst: "Fastlege",
  },
};

export const fastlegerMock = [
  fastlege,
  {
    ...fastlege,
    fornavn: "Vikarlege",
    mellomnavn: "sss",
    etternavn: "Vikarsen",
    fnr: "12045507971",
    herId: 711,
    helsepersonellregisterId: fastlege.helsepersonellregisterId + 1,
    gyldighet: {
      fom: leggTilDagerPaDato(new Date(), -300).toISOString(),
      tom: leggTilDagerPaDato(new Date(), 300).toISOString(),
    },
    relasjon: {
      kodeVerdi: RelasjonKodeVerdi.VIKAR,
      kodeTekst: "Vikar",
    },
  },
  {
    ...fastlege,
    fornavn: "Legensvikar",
    mellomnavn: "ss",
    etternavn: "Vikarheim",
    fnr: "12055507971",
    herId: 711,
    helsepersonellregisterId: fastlege.helsepersonellregisterId + 2,
    gyldighet: {
      fom: leggTilDagerPaDato(new Date(), -100).toISOString(),
      tom: leggTilDagerPaDato(new Date(), 400).toISOString(),
    },
    relasjon: {
      kodeVerdi: RelasjonKodeVerdi.VIKAR,
      kodeTekst: "Vikar",
    },
  },
];
