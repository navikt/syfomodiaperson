import mockSykmeldinger from "./mockSykmeldinger";

const mockSM = mockSykmeldinger[0];

export const mockSykmeldingWithArbeidsevne = {
  ...mockSM,
  tiltakArbeidsplassen: "Tilrettelegging",
  andreTiltak: "TiltakAndre",
  tiltakNAV: "TiltakAndre",
};

export const mockSykmeldingWithArbeidsgiver = {
  ...mockSM,
  arbeidsgiver: {
    navn: "AG",
    stillingsprosent: 100,
  },
};

export const mockSykmeldingerWithBekreftelse = {
  ...mockSM,
  behandler: {
    fornavn: "Lego",
    mellomnavn: "Las",
    etternavn: "Legesen",
    tlf: "12345678",
  },
  behandletTidspunkt: "2020-01-21T22:00:00Z",
};

export const mockSykmeldingWithDiagnoseInfo = {
  ...mockSM,
  medisinskVurdering: {
    hovedDiagnose: {
      kode: "L87",
      system: "ICPC-2",
      tekst: "TENDINITT INA",
    },
    biDiagnoser: [
      {
        kode: "L87",
        system: "ICPC-2",
        tekst: "GANGLION SENE",
      },
    ],
    annenFraversArsak: {
      beskrivelse: "Annen Grunn",
      grunn: ["GODKJENT_HELSEINSTITUSJON"],
    },
    svangerskap: true,
    yrkesskade: true,
    yrkesskadeDato: "2020-01-22",
  },
  skjermesForPasient: false,
};

export const mockSykmeldingWithPrognoseErIArbeid = {
  ...mockSM,
  prognose: {
    arbeidsforEtterPeriode: true,
    hensynArbeidsplassen: "Hensyn",
    erIArbeid: {
      egetArbeidPaSikt: true,
      annetArbeidPaSikt: true,
      arbeidFOM: "2020-01-22",
      vurderingsdato: "2020-01-22",
    },
    erIkkeIArbeid: null,
  },
};

export const mockSykmeldingWithPrognoseErIkkeIArbeid = {
  ...mockSM,
  prognose: {
    arbeidsforEtterPeriode: false,
    hensynArbeidsplassen: "Hensyn",
    erIArbeid: null,
    erIkkeIArbeid: {
      arbeidsforPaSikt: true,
      arbeidsforFOM: "2020-01-22",
      vurderingsdato: "2020-01-22",
    },
  },
};

export const mockSykmeldingWithMeldingTilNav = {
  ...mockSM,
  meldingTilNAV: {
    bistandUmiddelbart: true,
    beskrivBistand: "Bistand",
  },
};

export const mockSykmeldingWithMottakendeArbeidsgiver = {
  ...mockSM,
  sykmeldingStatus: {
    arbeidsgiver: {
      juridiskOrgnummer: "1234567",
      orgNavn: "Bedrift",
      orgnummer: "7654321",
    },
  },
};

export const mockSykmeldingWithoutMottakendeArbeidsgiver = {
  ...mockSM,
  sykmeldingStatus: {
    statusEvent: "APEN",
    timestamp: "2020-01-28T09:38:05.414834Z",
    arbeidsgiver: null,
    sporsmalOgSvarListe: null,
  },
};

export const mockSykmeldingWithPeriodeWithAktivitetIkkeMulig = {
  ...mockSM,
  sykmeldingsperioder: [
    {
      fom: "2020-01-22",
      tom: "2020-05-22",
      gradert: null,
      behandlingsdager: null,
      innspillTilArbeidsgiver: null,
      type: "AKTIVITET_IKKE_MULIG",
      aktivitetIkkeMulig: {
        medisinskArsak: {
          beskrivelse: "Beskrivelse",
          arsak: ["TILSTAND_HINDRER_AKTIVITET"],
        },
        arbeidsrelatertArsak: {
          beskrivelse: "Beskrivelse2",
          arsak: ["MANGLENDE_TILRETTELEGGING"],
        },
      },
    },
  ],
};

export const mockSykmeldingWithPeriodeWithGradert = {
  ...mockSM,
  sykmeldingsperioder: [
    {
      fom: "2020-01-22",
      tom: "2020-05-22",
      gradert: {
        grad: 50,
        reisetilskudd: true,
      },
      behandlingsdager: null,
      innspillTilArbeidsgiver: null,
      type: "GRADERT",
      aktivitetIkkeMulig: null,
    },
  ],
};

export const mockSykmeldingWithTwoPerioder = {
  ...mockSM,
  sykmeldingsperioder: [
    {
      fom: "2020-01-22",
      tom: "2020-05-22",
      gradert: null,
      behandlingsdager: null,
      innspillTilArbeidsgiver: null,
      type: "AKTIVITET_IKKE_MULIG",
      aktivitetIkkeMulig: null,
    },
    {
      fom: "2020-02-17",
      tom: "2020-03-01",
      gradert: null,
      behandlingsdager: 2,
      innspillTilArbeidsgiver: null,
      type: "BEHANDLINGSDAGER",
      aktivitetIkkeMulig: null,
    },
  ],
};

export const mockSykmeldingWithStatus = (status) => {
  return {
    ...mockSM,
    sykmeldingStatus: {
      statusEvent: status,
      timestamp: "2020-01-29T09:38:05.414834Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: null,
    },
  };
};

export const mockSykmeldingWithSporsmalOgSvarListe = {
  ...mockSM,
  sykmeldingStatus: {
    sporsmalOgSvarListe: [
      {
        tekst: "Jeg er sykmeldt fra",
        svar: {
          svar: "ARBEIDSTAKER",
          svartype: "ARBEIDSSITUASJON",
        },
        shortName: "ARBEIDSSITUASJON",
      },
      {
        tekst:
          "Har du forsikring som gjelder de første 16 dagene av sykefraværet?",
        svar: {
          svar: "NEI",
          svartype: "JA_NEI",
        },
        shortName: "FORSIKRING",
      },
      {
        tekst:
          "Brukte du egenmelding eller noen annen sykmelding før datoen denne sykmeldingen gjelder fra?",
        svar: {
          svar: "JA",
          svartype: "JA_NEI",
        },
        shortName: "FRAVAER",
      },
      {
        tekst:
          "Hvilke dager var du borte fra jobb før datoen sykmeldingen gjelder fra?",
        shortName: "PERIODE",
        svar: {
          svarType: "PERIODER",
          svar: '[{"fom":"2020-02-24","tom":"2020-03-22"}]',
        },
      },
      {
        tekst: "Ny nærmeste leder?!",
        svar: {
          svar: "true",
          svartype: "JA_NEI",
        },
        shortName: "NY_NARMESTE_LEDER",
      },
    ],
  },
};

export const mockSykmeldingWithKontaktMedPasient = {
  ...mockSM,
  kontaktMedPasient: {
    kontaktDato: "2020-02-02T02:02:02.202Z",
    begrunnelseIkkeKontakt: "Ikke kontakt",
  },
};

export const mockSykmeldingerWithUtdypendeOpplysningerPkt62 = {
  ...mockSM,
  utdypendeOpplysninger: {
    6.2: {
      "6.2.1": {
        sporsmal:
          "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
        svar: "Pkt. 6.2.1",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
      "6.2.2": {
        sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
        svar: "Pkt. 6.2.2",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
      "6.2.3": {
        sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
        svar: "Pkt. 6.2.3",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
      "6.2.4": {
        sporsmal:
          "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
        svar: "Pkt. 6.2.4",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
    },
  },
};

export const mockSykmeldingerWithUtdypendeOpplysningerPkt63 = {
  ...mockSM,
  utdypendeOpplysninger: {
    6.3: {
      "6.3.1": {
        sporsmal:
          "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
        svar: "Pkt. 6.3.1",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
      "6.3.2": {
        sporsmal:
          "Beskriv pågående og planlagt henvisnng, utredning og/eller behandling. Lar dette seg kombinere med delvis arbeid?",
        svar: "Pkt. 6.3.2",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
    },
  },
};

export const mockSykmeldingerWithUtdypendeOpplysningerPkt62SomeFieldsOmitted = {
  ...mockSM,
  utdypendeOpplysninger: {
    6.2: {
      "6.2.1": {
        sporsmal:
          "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
        svar: "Pkt. 6.2.1",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
      "6.2.2": {
        sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
        svar: "Pkt. 6.2.2",
        restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
      },
    },
  },
};

export const mockSykmeldingerWithEgenmeldt = {
  ...mockSM,
  egenmeldt: true,
};

export const mockSykmeldingerWithHarRedusertArbeidsgiverperiode = {
  ...mockSM,
  harRedusertArbeidsgiverperiode: true,
};

export const mockSykmeldingerWithPapirsykmelding = {
  ...mockSM,
  papirsykmelding: true,
};
