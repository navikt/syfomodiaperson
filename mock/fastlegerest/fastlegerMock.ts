import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";

export const fastlegerMock = [
  {
    fornavn: "Lego",
    mellomnavn: "Las",
    etternavn: "Legesen",
    fnr: "99900011122",
    herId: 7777777,
    helsepersonellregisterId: 8888888,
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
      fom: "2021-10-01",
      tom: "9999-12-31",
    },
  },
  {
    fornavn: "Annen",
    mellomnavn: "Tidligere",
    etternavn: "Legesen",
    fnr: "99900011142",
    herId: 8887777,
    helsepersonellregisterId: 8888888,
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
      fom: "2011-10-01",
      tom: "2021-10-01",
    },
  },
];
