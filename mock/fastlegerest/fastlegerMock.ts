import dayjs from "dayjs";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
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
      fom: dayjs(new Date()).subtract(300, "days").toISOString(),
      tom: dayjs(new Date()).add(300, "days").toISOString(),
    },
    relasjon: {
      kodeVerdi: RelasjonKodeVerdi.VIKAR,
      kodeTekst: "Vikar",
    },
    stillingsprosent: 60,
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
      fom: dayjs(new Date()).subtract(100, "days").toISOString(),
      tom: dayjs(new Date()).add(400, "days").toISOString(),
    },
    relasjon: {
      kodeVerdi: RelasjonKodeVerdi.VIKAR,
      kodeTekst: "Vikar",
    },
    stillingsprosent: null,
  },
];
