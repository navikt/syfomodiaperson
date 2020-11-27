/* eslint-disable max-len */
const mockSykepengesoknader = [
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115484,
        periode: {
          fom: "2018-08-18",
          tom: "2018-08-31",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-18",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "b9732cc7-6101-446e-a1ef-ec25a425b4fb",
    identdato: "2018-08-18",
    korrigerer: null,
    opprettetDato: "2018-09-07",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "e425a750-7f39-4974-9a06-fa1775f987c9",
    sykmeldingSkrevetDato: "2018-08-29",
    tom: "2018-08-31",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115312,
        periode: {
          fom: "2018-08-10",
          tom: "2018-09-01",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: "2018-09-05",
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-10",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "563b814b-3707-4421-84a2-cf1916f5cd04",
    identdato: "2018-08-10",
    korrigerer: null,
    opprettetDato: "2018-09-05",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "AVBRUTT",
    sykmeldingId: "7565fac5-dbcb-41c4-bf5b-02a0a1fd372f",
    sykmeldingSkrevetDato: "2018-08-27",
    tom: "2018-09-01",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115005,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "7022f438-7071-4058-ad2c-753586ce2025",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt lørdag 25.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 09.08.2018 til 24.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 03.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 25.08.2018 – 02.09.2018 var du 100 % sykmeldt fra KONKURS BEDRIFT OG VENNER AS. Jobbet du noe i denne perioden?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [],
    sendtTilArbeidsgiverDato: "2018-09-03",
    sendtTilNAVDato: "2018-09-03",
    status: "SENDT",
    sykmeldingId: "e13ecca3-3d19-49c7-b5e5-1678f61a330b",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: {
          arbeidsgrad: 55,
          arbeidstimerNormalUke: 40.0,
          beregnetArbeidsgrad: null,
          timer: null,
        },
        grad: 50,
        id: 115017,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "d0a589ea-0ace-4499-b98c-50e64bbdd1a0",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt torsdag 02.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 17.07.2018 til 01.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 03.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 25.08.2018 – 02.09.2018 skulle du jobbe 50 % av ditt normale arbeid hos KONKURS BEDRIFT OG VENNER AS. Jobbet du mer enn dette?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mange timer jobbet du per uke før du ble sykmeldt?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "40 timer per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mye jobbet du totalt i denne perioden hos KONKURS BEDRIFT OG VENNER AS?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "55 prosent per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [],
    sendtTilArbeidsgiverDato: "2018-09-03",
    sendtTilNAVDato: "2018-09-03",
    status: "SENDT",
    sykmeldingId: "8df7b467-4ed1-4279-954a-0dd544a78f35",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: {
          arbeidsgrad: 40,
          arbeidstimerNormalUke: 25.0,
          beregnetArbeidsgrad: null,
          timer: null,
        },
        grad: 100,
        id: 115006,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [
      {
        annenInntektskildeType: "ANDRE_ARBEIDSFORHOLD",
        sykmeldt: false,
      },
      {
        annenInntektskildeType: "SELVSTENDIG_NAERINGSDRIVENDE",
        sykmeldt: false,
      },
      {
        annenInntektskildeType: "SELVSTENDIG_NAERINGSDRIVENDE_DAGMAMMA",
        sykmeldt: false,
      },
      {
        annenInntektskildeType: "JORDBRUKER_FISKER_REINDRIFTSUTOEVER",
        sykmeldt: false,
      },
      {
        annenInntektskildeType: "FRILANSER",
        sykmeldt: false,
      },
      {
        annenInntektskildeType: "ANNET",
        sykmeldt: false,
      },
    ],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [
      {
        fom: "2018-08-29",
        tom: "2018-08-30",
      },
    ],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: "2018-09-01",
    id: "be3a8632-46ce-47ff-b13b-1226c0931809",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt torsdag 02.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 17.07.2018 til 01.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 03.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: null,
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Den 01.09.2018",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "DATO",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 25.08.2018 – 31.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Jeg har...",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "hatt ferie",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 29.08.2018 til 30.08.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "hatt permisjon",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 28.08.2018 til 30.08.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "oppholdt meg utenfor Norge",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "RADIOKNAPPER",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 28.08.2018 til 30.08.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst:
                              "Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 25.08.2018 – 31.08.2018 var du 100 % sykmeldt fra KONKURS BEDRIFT OG VENNER AS. Jobbet du noe i denne perioden?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mange timer jobbet du per uke før du ble sykmeldt?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "25 timer per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mye jobbet du totalt i denne perioden hos KONKURS BEDRIFT OG VENNER AS?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "40 prosent per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Hvilke andre inntektskilder har du?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Andre arbeidsforhold",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst: "Er du sykmeldt fra dette?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Selvstendig næringsdrivende",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst: "Er du sykmeldt fra dette?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Selvstendig næringsdrivende dagmamma",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst: "Er du sykmeldt fra dette?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Jordbruker / Fisker / Reindriftsutøver",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst: "Er du sykmeldt fra dette?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Frilanser",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst: "Er du sykmeldt fra dette?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Annet",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 25.08.2018 – 31.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Når startet du på utdanningen?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Den 07.08.2018",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Er utdanningen et fulltidsstudium?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Ja",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "RADIOKNAPPER",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [
      {
        fom: "2018-08-28",
        tom: "2018-08-30",
      },
    ],
    sendtTilArbeidsgiverDato: "2018-09-04",
    sendtTilNAVDato: "2018-09-04",
    status: "SENDT",
    sykmeldingId: "38f40907-f66c-4e90-93d2-bbbc8f013750",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: {
      erUtdanningFulltidsstudium: true,
      utdanningStartdato: "2018-08-07",
    },
    utenlandsopphold: {
      perioder: [
        {
          fom: "2018-08-28",
          tom: "2018-08-30",
        },
      ],
      soektOmSykepengerIPerioden: false,
    },
  },
  {
    aktiviteter: [
      {
        avvik: {
          arbeidsgrad: null,
          arbeidstimerNormalUke: 20.0,
          beregnetArbeidsgrad: 83,
          timer: 10.0,
        },
        grad: 100,
        id: 115004,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [
      {
        fom: "2018-08-30",
        tom: "2018-08-31",
      },
    ],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "7a28a5ed-b711-4359-a7e6-d163c5bc1cb1",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt torsdag 02.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 17.07.2018 til 01.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 03.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Jeg har...",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "hatt ferie",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 30.08.2018 til 31.08.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 25.08.2018 – 02.09.2018 var du 100 % sykmeldt fra KONKURS BEDRIFT OG VENNER AS. Jobbet du noe i denne perioden?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mange timer jobbet du per uke før du ble sykmeldt?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "20 timer per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mye jobbet du totalt i denne perioden hos KONKURS BEDRIFT OG VENNER AS?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "10 timer totalt",
                        verdier: {},
                      },
                      tilleggstekst: {
                        ledetekst: {
                          nokkel: null,
                          tekst:
                            "Vår foreløpige beregning er at du jobbet <strong>83 %</strong> av stillingen din.",
                          verdier: {},
                        },
                        type: "HTML",
                      },
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [],
    sendtTilArbeidsgiverDato: "2018-09-07",
    sendtTilNAVDato: "2018-09-07",
    status: "SENDT",
    sykmeldingId: "031182c9-0b9a-47ba-892b-70a3064f0562",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115008,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: "2018-09-05",
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "8a3e5f9f-91b7-4d37-b843-08fc41e82192",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "AVBRUTT",
    sykmeldingId: "d25cd545-2c0c-4c69-9bdc-51ae11476969",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: {
          arbeidsgrad: 20,
          arbeidstimerNormalUke: 20.0,
          beregnetArbeidsgrad: null,
          timer: null,
        },
        grad: 100,
        id: 115003,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "820bccc0-da79-47f3-803e-7fff14f98cf4",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt torsdag 02.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 17.07.2018 til 01.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 03.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 25.08.2018 – 02.09.2018 var du 100 % sykmeldt fra KONKURS BEDRIFT OG VENNER AS. Jobbet du noe i denne perioden?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mange timer jobbet du per uke før du ble sykmeldt?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "20 timer per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
                {
                  ledetekst: {
                    nokkel: null,
                    tekst:
                      "Hvor mye jobbet du totalt i denne perioden hos KONKURS BEDRIFT OG VENNER AS?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "20 prosent per uke",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 25.08.2018 – 02.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [],
    sendtTilArbeidsgiverDato: "2018-09-03",
    sendtTilNAVDato: "2018-09-03",
    status: "SENDT",
    sykmeldingId: "4017e61f-005c-4c64-9173-694fca3da1ba",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115009,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-02",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: "2018-09-05",
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "0ff75b60-7db3-4f0a-b4f5-c3620d46f68d",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-04",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "AVBRUTT",
    sykmeldingId: "377058f0-ec65-445d-81f4-4e5d78b54af9",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-02",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115090,
        periode: {
          fom: "2018-08-26",
          tom: "2018-09-03",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-26",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "d2afa3f8-faac-4c92-a4d7-6ed906b5138e",
    identdato: "2018-08-26",
    korrigerer: null,
    opprettetDato: "2018-09-07",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "6c2f6583-21b2-4e2c-8219-a21930ff74f8",
    sykmeldingSkrevetDato: "2018-08-26",
    tom: "2018-09-03",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115466,
        periode: {
          fom: "2018-08-29",
          tom: "2018-09-06",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-29",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "181a371c-12c2-4194-bd3d-2a2578b88ae6",
    identdato: "2018-08-29",
    korrigerer: null,
    opprettetDato: "2018-09-07",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "bff51855-21a4-4047-acc5-7e32d6265e3e",
    sykmeldingSkrevetDato: "2018-08-29",
    tom: "2018-09-06",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115485,
        periode: {
          fom: "2018-08-29",
          tom: "2018-09-06",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-29",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "03cffc00-ca4a-48b2-8287-39d4c9dd981d",
    identdato: "2018-08-29",
    korrigerer: null,
    opprettetDato: "2018-09-10",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "9b808952-52ad-4a5c-b01d-9e21d88a2e92",
    sykmeldingSkrevetDato: "2018-08-29",
    tom: "2018-09-06",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115457,
        periode: {
          fom: "2018-08-29",
          tom: "2018-09-06",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-29",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "22756994-6eb6-4886-abf8-0fae5f74199f",
    identdato: "2018-08-29",
    korrigerer: null,
    opprettetDato: "2018-09-10",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "54cecb8f-6ea2-4898-8668-9d01a2465982",
    sykmeldingSkrevetDato: "2018-08-29",
    tom: "2018-09-06",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115442,
        periode: {
          fom: "2018-08-28",
          tom: "2018-09-08",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-28",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "1e866a7f-039d-4629-93e1-5cf96d049ef7",
    identdato: "2018-08-28",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "2522be27-2aed-4bed-8912-be4fa3fd89b0",
    sykmeldingSkrevetDato: "2018-08-28",
    tom: "2018-09-08",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115010,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-10",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: "2018-09-02",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "ce1b0281-7a5c-40c8-9de5-cdd2b3da4b93",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-03",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt torsdag 02.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 17.07.2018 til 01.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 11.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 25.08.2018 – 10.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 25.08.2018 – 10.09.2018 var du 100 % sykmeldt fra KONKURS BEDRIFT OG VENNER AS. Jobbet du noe i denne perioden?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 25.08.2018 – 10.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [],
    sendtTilArbeidsgiverDato: "2018-09-10",
    sendtTilNAVDato: "2018-09-10",
    status: "SENDT",
    sykmeldingId: "164368fa-1fcc-4341-b3dc-820c8f20a384",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-10",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115449,
        periode: {
          fom: "2018-08-28",
          tom: "2018-09-10",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-28",
    forrigeSendteSoknadTom: "2018-09-10",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "73831438-e83d-4a55-a8b7-74612e23bf74",
    identdato: "2018-08-28",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "d096644c-9ae4-4bb0-b32b-fc733389a7a5",
    sykmeldingSkrevetDato: "2018-08-28",
    tom: "2018-09-10",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115444,
        periode: {
          fom: "2018-08-28",
          tom: "2018-09-10",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-28",
    forrigeSendteSoknadTom: "2018-09-10",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "6ab6fff5-05ad-4407-97c2-03a42e4fa429",
    identdato: "2018-08-28",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "NY",
    sykmeldingId: "5aee2076-5a73-43ca-b781-389aea9bac2a",
    sykmeldingSkrevetDato: "2018-08-28",
    tom: "2018-09-10",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115443,
        periode: {
          fom: "2018-08-28",
          tom: "2018-09-10",
        },
      },
    ],
    andreInntektskilder: [
      {
        annenInntektskildeType: "ANDRE_ARBEIDSFORHOLD",
        sykmeldt: false,
      },
    ],
    ansvarBekreftet: true,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: true,
    del: 1,
    egenmeldingsperioder: [
      {
        fom: "2018-08-01",
        tom: "2018-08-01",
      },
    ],
    ferie: [
      {
        fom: "2018-09-04",
        tom: "2018-09-04",
      },
    ],
    fom: "2018-08-28",
    forrigeSendteSoknadTom: "2018-09-10",
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: "2018-09-05",
    id: "7562da23-3d36-46ab-9d7f-f7d73da2335f",
    identdato: "2018-08-28",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: {
      bekreftetKorrektInformasjon: {
        ledetekst: null,
        svar: [
          {
            ledetekst: {
              nokkel: null,
              tekst:
                "Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.",
              verdier: {},
            },
            tilleggstekst: null,
            type: "CHECKBOX",
            undersporsmal: [],
          },
        ],
        type: null,
      },
      soknad: [
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Vi har registrert at du ble sykmeldt torsdag 02.08.2018. Brukte du egenmeldinger og/eller var du sykmeldt i perioden 17.07.2018 til 01.08.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: null,
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Fra 01.08.2018 til 01.08.2018",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "DATOSPENN",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "EGENMELDINGSDAGER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Var du tilbake i fullt arbeid hos KONKURS BEDRIFT OG VENNER AS før 11.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: null,
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Den 05.09.2018",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "DATO",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "GJENOPPTATT_ARBEID_FULLT_UT",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 28.08.2018 – 04.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Jeg har...",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "hatt ferie",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 04.09.2018 til 04.09.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "hatt permisjon",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 04.09.2018 til 04.09.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "oppholdt meg utenfor Norge",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "RADIOKNAPPER",
                      undersporsmal: [
                        {
                          ledetekst: null,
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Fra 03.09.2018 til 03.09.2018",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "DATOSPENN",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst:
                              "Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "FERIE_PERMISJON_UTENLANDSOPPHOLD",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "I perioden 28.08.2018 – 04.09.2018 var du 100 % sykmeldt fra KONKURS BEDRIFT OG VENNER AS. Jobbet du noe i denne perioden?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Nei",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [],
            },
          ],
          type: "AKTIVITET",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du andre inntektskilder, eller jobber du for andre enn KONKURS BEDRIFT OG VENNER AS?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Hvilke andre inntektskilder har du?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Andre arbeidsforhold",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "CHECKBOX",
                      undersporsmal: [
                        {
                          ledetekst: {
                            nokkel: null,
                            tekst: "Er du sykmeldt fra dette?",
                            verdier: {},
                          },
                          svar: [
                            {
                              ledetekst: {
                                nokkel: null,
                                tekst: "Nei",
                                verdier: {},
                              },
                              tilleggstekst: null,
                              type: "RADIOKNAPPER",
                              undersporsmal: [],
                            },
                          ],
                          type: null,
                        },
                      ],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "INNTEKTSKILDER",
        },
        {
          ledetekst: {
            nokkel: null,
            tekst:
              "Har du vært under utdanning i løpet av perioden 28.08.2018 – 04.09.2018?",
            verdier: {},
          },
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst: "Ja",
                verdier: {},
              },
              tilleggstekst: null,
              type: "RADIOKNAPPER",
              undersporsmal: [
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Når startet du på utdanningen?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Den 04.09.2018",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "TEKSTSVAR",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
                {
                  ledetekst: {
                    nokkel: null,
                    tekst: "Er utdanningen et fulltidsstudium?",
                    verdier: {},
                  },
                  svar: [
                    {
                      ledetekst: {
                        nokkel: null,
                        tekst: "Ja",
                        verdier: {},
                      },
                      tilleggstekst: null,
                      type: "RADIOKNAPPER",
                      undersporsmal: [],
                    },
                  ],
                  type: null,
                },
              ],
            },
          ],
          type: "UTDANNING",
        },
        {
          ledetekst: null,
          svar: [
            {
              ledetekst: {
                nokkel: null,
                tekst:
                  "Jeg vet at dersom jeg gir uriktige opplysninger, eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar. Jeg er også klar over at jeg må melde fra til NAV dersom jeg sitter i varetekt, soner straff eller er under forvaring.  ",
                verdier: {},
              },
              tilleggstekst: null,
              type: "CHECKBOX",
              undersporsmal: [],
            },
          ],
          type: "ANSVAR_BEKREFTET",
        },
      ],
      vaerKlarOverAt: {
        ledetekst: {
          nokkel: null,
          tekst:
            "<p>Vær klar over at</p><ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>",
          verdier: {},
        },
        type: "HTML",
      },
    },
    permisjon: [
      {
        fom: "2018-09-04",
        tom: "2018-09-04",
      },
    ],
    sendtTilArbeidsgiverDato: "2018-09-10",
    sendtTilNAVDato: "2018-09-10",
    status: "SENDT",
    sykmeldingId: "cca2c09c-8bd0-45fa-9e67-29e75b0e3500",
    sykmeldingSkrevetDato: "2018-08-28",
    tom: "2018-09-10",
    utdanning: {
      erUtdanningFulltidsstudium: true,
      utdanningStartdato: "2018-09-04",
    },
    utenlandsopphold: {
      perioder: [
        {
          fom: "2018-09-03",
          tom: "2018-09-03",
        },
      ],
      soektOmSykepengerIPerioden: false,
    },
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115530,
        periode: {
          fom: "2018-09-01",
          tom: "2018-09-12",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-09-01",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "4129e63c-5ff8-4ad7-8dcb-55dc37bff298",
    identdato: "2018-09-01",
    korrigerer: null,
    opprettetDato: "2018-09-10",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "FREMTIDIG",
    sykmeldingId: "b118ea54-5e46-4ac7-ae32-64eb7926f36d",
    sykmeldingSkrevetDato: "2018-09-01",
    tom: "2018-09-12",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115091,
        periode: {
          fom: "2018-08-26",
          tom: "2018-09-15",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-26",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "ed401d1a-fcc5-444e-a7e6-4959a8b529c1",
    identdato: "2018-08-26",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "FREMTIDIG",
    sykmeldingId: "f81149ec-483b-45f3-a711-02d82c1e551d",
    sykmeldingSkrevetDato: "2018-08-26",
    tom: "2018-09-15",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115089,
        periode: {
          fom: "2018-08-26",
          tom: "2018-09-20",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-26",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "c5bf301f-2ccd-4238-a751-fd1bec769bb5",
    identdato: "2018-08-26",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "FREMTIDIG",
    sykmeldingId: "d0bda351-b004-43ca-80d0-8805d062eadc",
    sykmeldingSkrevetDato: "2018-08-26",
    tom: "2018-09-20",
    utdanning: null,
    utenlandsopphold: null,
  },
  {
    aktiviteter: [
      {
        avvik: null,
        grad: 100,
        id: 115088,
        periode: {
          fom: "2018-08-25",
          tom: "2018-09-20",
        },
      },
    ],
    andreInntektskilder: [],
    ansvarBekreftet: false,
    arbeidsgiver: {
      naermesteLeder: null,
      navn: "KONKURS BEDRIFT OG VENNER AS",
      orgnummer: "000111222",
      stilling: null,
    },
    arbeidsgiverForskutterer: null,
    avbruttDato: null,
    bekreftetKorrektInformasjon: false,
    del: 1,
    egenmeldingsperioder: [],
    ferie: [],
    fom: "2018-08-25",
    forrigeSendteSoknadTom: null,
    forrigeSykeforloepTom: null,
    gjenopptattArbeidFulltUtDato: null,
    id: "78a1b8d5-4ddd-4f58-b245-830eef8840f8",
    identdato: "2018-08-25",
    korrigerer: null,
    opprettetDato: "2018-09-06",
    oppsummering: null,
    permisjon: [],
    sendtTilArbeidsgiverDato: null,
    sendtTilNAVDato: null,
    status: "FREMTIDIG",
    sykmeldingId: "2071c4f8-ccd2-4731-944a-e80a3765ca2c",
    sykmeldingSkrevetDato: "2018-08-25",
    tom: "2018-09-20",
    utdanning: null,
    utenlandsopphold: null,
  },
];
export default mockSykepengesoknader;
/* eslint-enable max-len */
