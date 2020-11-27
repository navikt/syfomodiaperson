import { expect } from "chai";
import {
  erArbeidsforEtterPerioden,
  erBedringAvArbeidsevnenInformasjon,
  erEkstraDiagnoseInformasjon,
  erFriskmeldingInformasjon,
  erHensynPaaArbeidsplassenInformasjon,
  erMeldingTilArbeidsgiverInformasjon,
  erMeldingTilNavInformasjon,
  erMulighetForArbeidInformasjon,
  erUtdypendeOpplysningerInformasjon,
  arbeidsgivernavnEllerArbeidssituasjon,
  sykmeldingerMedStatusSendt,
  sykmeldingerInnenforOppfolgingstilfellet,
  sykmeldingerSortertNyestTilEldst,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingperioderSortertEldstTilNyest,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  erBehandlingsdagerEllerReisetilskudd,
  finnAvventendeSykmeldingTekst,
  sykmeldingerHasCoronaDiagnose,
} from "../../src/utils/sykmeldinger/sykmeldingUtils";
import { ANTALL_MS_DAG } from "../../src/utils/datoUtils";

describe("sykmeldingUtils", () => {
  describe("finnAvventendeSykmeldingTekst", () => {
    it("skal returnere teksten fra avventende-feltet i en periode, hvis det finnes", () => {
      const innspillTilArbeidsgiver = "Innspill til arbeidsgiver";
      const sykmelding = {
        mulighetForArbeid: {
          perioder: [
            {
              avventende: innspillTilArbeidsgiver,
              behandlingsdager: null,
              fom: "2019-01-01",
              grad: 100,
              reisetilskudd: null,
              tom: "2019-01-10",
            },
          ],
        },
      };

      const avventende = finnAvventendeSykmeldingTekst(sykmelding);

      expect(avventende).to.equal(innspillTilArbeidsgiver);
    });

    it("skal returnere undefined hvis ingen av periodene er avventende", () => {
      const sykmelding = {
        mulighetForArbeid: {
          perioder: [
            {
              avventende: null,
              behandlingsdager: null,
              fom: "2019-01-01",
              grad: null,
              reisetilskudd: null,
              tom: "2019-01-10",
            },
          ],
        },
      };

      const avventende = finnAvventendeSykmeldingTekst(sykmelding);

      expect(avventende).to.equal(undefined);
    });
  });

  describe("erBehandlingsdagerEllerReisetilskudd", () => {
    it("skal returnere true dersom minst én av sykmeldingperiodene er huket av på behandlingsdager", () => {
      const sykmelding = {
        mulighetForArbeid: {
          perioder: [
            {
              avventende: null,
              behandlingsdager: 4,
              fom: "2019-01-01",
              grad: null,
              reisetilskudd: null,
              tom: "2019-02-01",
            },
          ],
        },
      };

      const erEkstraInfo = erBehandlingsdagerEllerReisetilskudd(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });

    it("skal returnere true dersom minst én av sykmeldingperiodene er huket av på reisetilskudd", () => {
      const sykmelding = {
        mulighetForArbeid: {
          perioder: [
            {
              avventende: null,
              behandlingsdager: null,
              fom: "2019-01-01",
              grad: 40,
              reisetilskudd: true,
              tom: "2019-02-01",
            },
          ],
        },
      };

      const erEkstraInfo = erBehandlingsdagerEllerReisetilskudd(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });

    it("skal returnere false dersom ingen av sykmeldingperiodene er huket av på reisetilskudd eller behandlingsdager", () => {
      const sykmelding = {
        mulighetForArbeid: {
          perioder: [
            {
              avventende: null,
              behandlingsdager: null,
              fom: "2019-01-01",
              grad: 100,
              reisetilskudd: null,
              tom: "2019-02-01",
            },
          ],
        },
      };

      const erEkstraInfo = erBehandlingsdagerEllerReisetilskudd(sykmelding);

      expect(erEkstraInfo).to.equal(false);
    });
  });

  describe("erEkstraDiagnoseInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder ekstra informasjon om diagnose", () => {
      const sykmelding = {
        diagnose: {
          fravaersgrunnLovfestet: "Lovfestet grunn!",
          svangerskap: false,
          yrkesskade: true,
        },
      };

      const erEkstraInfo = erEkstraDiagnoseInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder ekstra informasjon om diagnose", () => {
      const sykmelding = {
        diagnose: {
          fravaersgrunnLovfestet: null,
          svangerskap: false,
          yrkesskade: false,
        },
      };

      const erIkkeEkstraInfo = erEkstraDiagnoseInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erMulighetForArbeidInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om mulighet for arbeid", () => {
      const sykmelding = {
        mulighetForArbeid: {
          aarsakAktivitetIkkeMulig433: "andre årsaker til sykefravær",
          aarsakAktivitetIkkeMulig434: "andre årsaker til sykefravær",
          aktivitetIkkeMulig433: ["Annet"],
          aktivitetIkkeMulig434: ["Annet"],
          perioder: [
            {
              avventende: null,
              behandlingsdager: null,
              fom: "2018-12-28",
              grad: 100,
              reisetilskudd: null,
              tom: "2019-01-08",
            },
            {
              avventende: null,
              behandlingsdager: null,
              fom: "2018-01-09",
              grad: 21,
              reisetilskudd: null,
              tom: "2019-01-15",
            },
          ],
        },
      };

      const erEkstraInfo = erMulighetForArbeidInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om mulighet for arbeid", () => {
      const sykmelding = {
        mulighetForArbeid: {
          perioder: [
            {
              avventende: null,
              behandlingsdager: null,
              fom: "2018-12-28",
              grad: 100,
              reisetilskudd: null,
              tom: "2019-01-08",
            },
          ],
        },
      };

      const erIkkeEkstraInfo = erMulighetForArbeidInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erFriskmeldingInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om friskmelding", () => {
      const sykmelding = {
        friskmelding: {
          antarReturAnnenArbeidsgiver: true,
          antarReturSammeArbeidsgiver: true,
          utenArbeidsgiverAntarTilbakeIArbeid: false,
        },
      };

      const erEkstraInfo = erFriskmeldingInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om friskmelding", () => {
      const sykmelding = {
        friskmelding: {
          antarReturAnnenArbeidsgiver: false,
          antarReturSammeArbeidsgiver: false,
          utenArbeidsgiverAntarTilbakeIArbeid: false,
        },
      };

      const erIkkeEkstraInfo = erFriskmeldingInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erArbeidsforEtterPerioden", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om den sykmeldte er arbeidsfør etter perioden", () => {
      const sykmelding = {
        friskmelding: {
          arbeidsfoerEtterPerioden: true,
        },
      };

      const erEkstraInfo = erArbeidsforEtterPerioden(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om den sykmeldte er arbeidsfør etter perioden", () => {
      const sykmelding = {
        friskmelding: {
          arbeidsfoerEtterPerioden: false,
        },
      };

      const erIkkeEkstraInfo = erArbeidsforEtterPerioden(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erHensynPaaArbeidsplassenInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om hensyn på arbeidsplassen", () => {
      const sykmelding = {
        friskmelding: {
          hensynPaaArbeidsplassen: "Må ta det pent",
        },
      };

      const erEkstraInfo = erHensynPaaArbeidsplassenInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om hensyn på arbeidsplassen", () => {
      const sykmelding = {
        friskmelding: {
          hensynPaaArbeidsplassen: null,
        },
      };

      const erIkkeEkstraInfo = erHensynPaaArbeidsplassenInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erUtdypendeOpplysningerInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder utdypende opplysninger", () => {
      const sykmelding = {
        utdypendeOpplysninger: {
          henvisningUtredningBehandling: "Henvist til fysio",
          paavirkningArbeidsevne:
            "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket",
          resultatAvBehandling: "Nei",
          sykehistorie: "Langvarig korsryggsmerter. Ømhet og smerte",
          sykehistoriePunkt63:
            "Pkt. 6.3.1: Langvarig korsryggsmerter. Ømhet og smerte",
          henvisningUtredningBehandlingPunkt63:
            "Pkt. 6.3.2: Henvist til fysio, dette påvirker arbeidsevnen",
        },
      };

      const erEkstraInfo = erUtdypendeOpplysningerInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder utdypende opplysninger", () => {
      const sykmelding = {
        utdypendeOpplysninger: {
          henvisningUtredningBehandling: null,
          paavirkningArbeidsevne: null,
          resultatAvBehandling: null,
          sykehistorie: null,
          sykehistoriePunkt63: null,
          henvisningUtredningBehandlingPunkt63: null,
        },
      };

      const erIkkeEkstraInfo = erUtdypendeOpplysningerInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erBedringAvArbeidsevnenInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om bedring av arbeidsevnen", () => {
      const sykmelding = {
        arbeidsevne: {
          tilretteleggingArbeidsplass: "Trenger nye sko",
          tiltakAndre: "Pasienten vil ha nye sko!",
          tiltakNAV: "NAV må gi pasienten skosåler til de nye skoene",
        },
      };

      const erEkstraInfo = erBedringAvArbeidsevnenInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om bedring av arbeidsevnen", () => {
      const sykmelding = {
        arbeidsevne: {
          tilretteleggingArbeidsplass: null,
          tiltakAndre: null,
          tiltakNAV: null,
        },
      };

      const erIkkeEkstraInfo = erBedringAvArbeidsevnenInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erMeldingTilNavInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om melding til nav", () => {
      const sykmelding = {
        meldingTilNav: {
          navBoerTaTakISaken: true,
        },
      };

      const erEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om melding til nav", () => {
      const sykmelding = {
        meldingTilNav: {
          navBoerTaTakISaken: false,
        },
      };

      const erIkkeEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erMeldingTilArbeidsgiverInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om melding til arbeidsgiver", () => {
      const sykmelding = {
        innspillTilArbeidsgiver: "Arbeidsgiver må gjøre noe!",
      };

      const erEkstraInfo = erMeldingTilArbeidsgiverInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om melding til arbeidsgiver", () => {
      const sykmelding = {
        innspillTilArbeidsgiver: null,
      };

      const erIkkeEkstraInfo = erMeldingTilArbeidsgiverInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("arbeidsgivernavnEllerArbeidssituasjon", () => {
    it("skal returnere navnet på arbeidsgiveren dersom det er satt", () => {
      const sykmelding = {
        innsendtArbeidsgivernavn: "Test Arbeidsgiver",
      };

      const innsendtArbeidsgivernavn = arbeidsgivernavnEllerArbeidssituasjon(
        sykmelding
      );

      expect(innsendtArbeidsgivernavn).to.equal("Test Arbeidsgiver");
    });
    it("Skal returnere arbeidssituasjon dersom innsendt arbeidsgivernavn ikke er satt", () => {
      const sykmelding = {
        innsendtArbeidsgivernavn: null,
        sporsmal: {
          arbeidssituasjon: "NAERINGSDRIVENDE",
        },
      };

      const arbeidssituasjon = arbeidsgivernavnEllerArbeidssituasjon(
        sykmelding
      );

      expect(arbeidssituasjon).to.equal("Selvstendig næringsdrivende");
    });
  });

  describe("sykmeldingerMedStatusSendt", () => {
    it("skal returnere en liste med bare innsendte sykmeldinger", () => {
      const sykmeldinger = [
        {
          status: "AVBRUTT",
        },
        {
          status: "SENDT",
        },
        {
          status: "AVBRUTT",
        },
      ];

      const sendteSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);

      expect(sendteSykmeldinger.length).to.equal(1);
    });
  });

  describe("sykmeldingerInnenforOppfolgingstilfellet", () => {
    it("skal returnere en liste med bare sykmeldinger innenfor oppfølgingstilfellet", () => {
      let oppfolgingstilfelleperioder = [];
      oppfolgingstilfelleperioder["123"] = {
        data: [
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 5),
            tom: new Date(Date.now() + ANTALL_MS_DAG * 15),
          },
        ],
      };

      oppfolgingstilfelleperioder["321"] = {
        data: [
          {
            orgnummer: "321",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "321",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
        ],
      };

      const sykmeldinger = [
        {
          orgnummer: "123",
          startLegemeldtFravaer: "2018-12-28",
        },
        {
          orgnummer: "321",
          startLegemeldtFravaer: "2017-01-01",
        },
      ];

      const sykmeldingerIOppfolgingstilfellet = sykmeldingerInnenforOppfolgingstilfellet(
        sykmeldinger,
        oppfolgingstilfelleperioder
      );

      expect(sykmeldingerIOppfolgingstilfellet.length).to.equal(1);
      expect(sykmeldingerIOppfolgingstilfellet[0].orgnummer).to.equal("123");
    });
  });

  describe("sykmeldingerSortertNyestTilEldst", () => {
    it("skal returnere en liste med sykmeldinger sortert etter utstedelsesdato", () => {
      const sykmeldinger = [
        {
          bekreftelse: {
            utstedelsesdato: "2019-01-05",
          },
        },
        {
          bekreftelse: {
            utstedelsesdato: "2019-01-01",
          },
        },
        {
          bekreftelse: {
            utstedelsesdato: "2019-01-02",
          },
        },
        {
          bekreftelse: {
            utstedelsesdato: "2019-01-04",
          },
        },
        {
          bekreftelse: {
            utstedelsesdato: "2019-01-03",
          },
        },
      ];

      const sykmeldingerSortertPaaUtstedelsesdato = sykmeldingerSortertNyestTilEldst(
        sykmeldinger
      );

      expect(sykmeldingerSortertPaaUtstedelsesdato.length).to.equal(5);
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[0].bekreftelse.utstedelsesdato
      ).to.equal("2019-01-05");
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[1].bekreftelse.utstedelsesdato
      ).to.equal("2019-01-04");
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[2].bekreftelse.utstedelsesdato
      ).to.equal("2019-01-03");
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[3].bekreftelse.utstedelsesdato
      ).to.equal("2019-01-02");
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[4].bekreftelse.utstedelsesdato
      ).to.equal("2019-01-01");
    });
  });

  describe("sykmeldingerGruppertEtterVirksomhet", () => {
    it("skal returnere en liste med én liste av sykmeldinger per virksomhet", () => {
      const sykmeldinger = [
        {
          mottakendeArbeidsgiver: {
            virksomhetsnummer: "1",
          },
        },
        {
          mottakendeArbeidsgiver: {
            virksomhetsnummer: "2",
          },
        },
        {
          mottakendeArbeidsgiver: {
            virksomhetsnummer: "2",
          },
        },
        {
          mottakendeArbeidsgiver: {
            virksomhetsnummer: "3",
          },
        },
        {
          mottakendeArbeidsgiver: {
            virksomhetsnummer: "1",
          },
        },
        {
          mottakendeArbeidsgiver: {
            virksomhetsnummer: "1",
          },
        },
      ];

      const sykmeldingerSortertPaaVirksomhetsnummer = sykmeldingerGruppertEtterVirksomhet(
        sykmeldinger
      );

      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer).length
      ).to.equal(3);
      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer["1"]).length
      ).to.equal(3);
      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer["2"]).length
      ).to.equal(2);
      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer["3"]).length
      ).to.equal(1);
    });
  });

  describe("sykmeldingperioderSortertEldstTilNyest", () => {
    it("skal returnere en liste med perioder sortert etter dato", () => {
      const sykmeldingperioder = [
        {
          fom: "2019-01-05",
        },
        {
          fom: "2019-01-04",
        },
        {
          fom: "2019-01-01",
        },
        {
          fom: "2019-01-02",
        },
        {
          fom: "2019-01-03",
        },
      ];

      const sykmeldingperioderSortertEtterDato = sykmeldingperioderSortertEldstTilNyest(
        sykmeldingperioder
      );

      expect(sykmeldingperioderSortertEtterDato.length).to.equal(5);
      expect(sykmeldingperioderSortertEtterDato[0].fom).to.equal("2019-01-01");
      expect(sykmeldingperioderSortertEtterDato[1].fom).to.equal("2019-01-02");
      expect(sykmeldingperioderSortertEtterDato[2].fom).to.equal("2019-01-03");
      expect(sykmeldingperioderSortertEtterDato[3].fom).to.equal("2019-01-04");
      expect(sykmeldingperioderSortertEtterDato[4].fom).to.equal("2019-01-05");
    });
  });

  describe("stringMedAlleGraderingerFraSykmeldingPerioder", () => {
    it("skal returnere en string med alle graderinger fra en sykmelding som ikke er 0/null", () => {
      const sykmeldingPerioderSortertEtterDato = [
        {
          grad: 20,
        },
        {
          grad: 100,
        },
        {
          grad: 0,
        },
        {
          grad: null,
        },
        {
          grad: 50,
        },
      ];

      const stringMedAllegraderinger = stringMedAlleGraderingerFraSykmeldingPerioder(
        sykmeldingPerioderSortertEtterDato
      );

      expect(stringMedAllegraderinger).to.equal("20% - 100% - 50%");
    });

    it("skal returnere en tom string hvis alle perioder har 0/null som grad", () => {
      const sykmeldingPerioderSortertEtterDato = [
        {
          grad: null,
        },
        {
          grad: 0,
        },
      ];

      const stringMedAllegraderinger = stringMedAlleGraderingerFraSykmeldingPerioder(
        sykmeldingPerioderSortertEtterDato
      );

      expect(stringMedAllegraderinger).to.equal("");
    });
  });

  describe("sykmeldingerHasCoronaDiagnose", () => {
    it("skal returnere true hvis det finnes minst én aktiv sykmelding med harRedusertArbeidsgiverperiode=true", () => {
      const sykmeldinger = [
        {
          status: "SENDT",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(Date.now() - 1000),
                tom: new Date(Date.now() + 1000),
              },
            ],
          },
          diagnose: {
            hoveddiagnose: {
              diagnosekode: "R991",
            },
            bidiagnoser: [],
          },
          harRedusertArbeidsgiverperiode: true,
        },
      ];

      const hasCorona = sykmeldingerHasCoronaDiagnose(sykmeldinger);

      expect(hasCorona).to.equal(true);
    });

    it("skal returnere false hvis sykmelding med korona-diagnose ikke er innsendt eller bekreftet", () => {
      const sykmeldinger = [
        {
          status: "NY",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(Date.now() - 1000),
                tom: new Date(Date.now() + 1000),
              },
            ],
          },
          diagnose: {
            hoveddiagnose: {
              diagnosekode: "R991",
            },
            bidiagnoser: [],
          },
          harRedusertArbeidsgiverperiode: true,
        },
      ];

      const hasCorona = sykmeldingerHasCoronaDiagnose(sykmeldinger);

      expect(hasCorona).to.equal(false);
    });

    it("skal returnere false hvis aktiv sykmelding harRedusertArbeidsgiverperiode=false", () => {
      const sykmeldinger = [
        {
          status: "SENDT",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(Date.now() - 1000),
                tom: new Date(Date.now() + 1000),
              },
            ],
          },
          diagnose: {
            hoveddiagnose: {
              diagnosekode: "L87",
            },
            bidiagnoser: [],
          },
          harRedusertArbeidsgiverperiode: false,
        },
      ];

      const hasCorona = sykmeldingerHasCoronaDiagnose(sykmeldinger);

      expect(hasCorona).to.equal(false);
    });

    it("skal returnere false hvis sykmeldingen ikke er aktiv i dag", () => {
      const sykmeldinger = [
        {
          status: "SENDT",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(Date.now() + 1000),
                tom: new Date(Date.now() + 2000),
              },
            ],
          },
          diagnose: {
            hoveddiagnose: {
              diagnosekode: "R991",
            },
            bidiagnoser: [],
          },
          harRedusertArbeidsgiverperiode: true,
        },
      ];

      const hasCorona = sykmeldingerHasCoronaDiagnose(sykmeldinger);

      expect(hasCorona).to.equal(false);
    });
  });
});
