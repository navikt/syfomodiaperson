function getPersonAdresse() {
  return {
    navn: "Samuel Jones",
    bostedsadresse: {
      angittFlyttedato: "2019-11-03",
      gyldigFraOgMed: "2019-11-03T00:00:00",
      gyldigTilOgMed: null,
      coAdressenavn: null,
      vegadresse: {
        matrikkelId: null,
        husnummer: "20",
        husbokstav: null,
        bruksenhetsnummer: null,
        adressenavn: "ØKERNVEIEN",
        kommunenummer: "0301",
        bydelsnummer: null,
        tilleggsnavn: null,
        postnummer: "0301",
      },
      matrikkeladresse: null,
      utenlandskAdresse: null,
      ukjentBosted: null,
    },
    kontaktadresse: {
      gyldigFraOgMed: "2020-11-03T16:12:43",
      gyldigTilOgMed: "2021-11-03T00:00:00",
      type: "Utland",
      coAdressenavn: null,
      postboksadresse: null,
      vegadresse: null,
      postadresseIFrittFormat: null,
      utenlandskAdresse: null,
      utenlandskAdresseIFrittFormat: {
        adresselinje1: "Gate1",
        adresselinje2: "Gate2",
        adresselinje3: "Gate3",
        postkode: null,
        byEllerStedsnavn: null,
        landkode: "DZA",
      },
    },
    oppholdsadresse: {
      gyldigFraOgMed: "2019-11-03T00:00:00",
      gyldigTilOgMed: null,
      coAdressenavn: null,
      utenlandskAdresse: null,
      vegadresse: {
        matrikkelId: null,
        husnummer: "20",
        husbokstav: null,
        bruksenhetsnummer: null,
        adressenavn: "ØKERNVEIEN",
        kommunenummer: "0301",
        bydelsnummer: null,
        tilleggsnavn: null,
        postnummer: "0301",
      },
      matrikkeladresse: null,
      oppholdAnnetSted: null,
    },
  };
}

module.exports = { getPersonAdresse };
