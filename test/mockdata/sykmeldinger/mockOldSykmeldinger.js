import { toDate } from "../../../src/utils/datoUtils";

const mockOldSykmeldinger = [
  {
    arbeidsevne: {
      tilretteleggingArbeidsplass: null,
      tiltakAndre: null,
      tiltakNAV: null,
    },
    arbeidsgiver: null,
    bekreftelse: {
      sykmelder: "Lego Legesen",
      sykmelderTlf: null,
      utstedelsesdato: toDate("2020-01-21T22:00:00Z"),
    },
    diagnose: {
      bidiagnoser: [],
      fravaerBeskrivelse: null,
      fravaersgrunnLovfestet: null,
      hoveddiagnose: {
        diagnose: null,
        diagnosekode: null,
        diagnosesystem: null,
      },
      svangerskap: null,
      yrkesskade: null,
      yrkesskadeDato: null,
    },
    friskmelding: {
      antarReturAnnenArbeidsgiver: null,
      antarReturSammeArbeidsgiver: null,
      antattDatoReturSammeArbeidsgiver: null,
      arbeidsfoerEtterPerioden: null,
      hensynPaaArbeidsplassen: null,
      tilbakemeldingReturArbeid: null,
      utenArbeidsgiverAntarTilbakeIArbeid: null,
      utenArbeidsgiverAntarTilbakeIArbeidDato: null,
      utenArbeidsgiverTilbakemelding: null,
    },
    id: "e425a750-7f39-4974-9a06-fa1775f987c9",
    identdato: null,
    innsendtArbeidsgivernavn: "PONTYPANDY FIRE SERVICE",
    innspillTilArbeidsgiver: null,
    meldingTilNav: {
      navBoerTaTakISaken: null,
      navBoerTaTakISakenBegrunnelse: null,
    },
    mottakendeArbeidsgiver: {
      juridiskOrgnummer: "110110110",
      navn: "PONTYPANDY FIRE SERVICE",
      virksomhetsnummer: "110110110",
    },
    mulighetForArbeid: {
      aarsakAktivitetIkkeMulig433: undefined,
      aarsakAktivitetIkkeMulig434: undefined,
      aktivitetIkkeMulig433: undefined,
      aktivitetIkkeMulig434: undefined,
      perioder: [
        {
          avventende: null,
          behandlingsdager: null,
          fom: toDate("2020-01-22"),
          grad: 100,
          reisetilskudd: null,
          tom: toDate("2020-05-22"),
        },
      ],
    },
    naermesteLederStatus: null,
    orgnummer: "110110110",
    pasient: {
      etternavn: null,
      fnr: "99887766554",
      fornavn: null,
      mellomnavn: null,
    },
    sendtdato: toDate("2020-01-29T09:38:05.414834Z"),
    mottattTidspunkt: "2020-01-21T23:00:00Z",
    skalViseSkravertFelt: true,
    sporsmal: {
      arbeidssituasjon: null,
      dekningsgrad: null,
      fravaersperioder: [],
      harAnnetFravaer: null,
      harForsikring: null,
    },
    startLegemeldtFravaer: null,
    status: "SENDT",
    stillingsprosent: null,
    tilbakedatering: {
      dokumenterbarPasientkontakt: null,
      tilbakedatertBegrunnelse: null,
    },
    utdypendeOpplysninger: {
      grupper: [],
      henvisningUtredningBehandling: undefined,
      paavirkningArbeidsevne: undefined,
      resultatAvBehandling: undefined,
      sykehistorie: undefined,
      sykehistoriePunkt63: undefined,
      henvisningUtredningBehandlingPunkt63: undefined,
    },
    valgtArbeidssituasjon: null,
    behandlingsutfall: {
      status: "OK",
      ruleHits: [
        {
          messageForSender: "messageForSender",
          messageForUser: "messageForUser",
          ruleName: "Rule",
          ruleStatus: null,
        },
      ],
    },
    egenmeldt: null,
    papirsykmelding: null,
    harRedusertArbeidsgiverperiode: null,
  },
];

export default mockOldSykmeldinger;
