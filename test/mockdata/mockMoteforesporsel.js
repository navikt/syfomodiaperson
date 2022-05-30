export const getMote = (mote) => {
  return Object.assign(
    {},
    {
      status: "OPPRETTET",
      opprettetTidspunkt: new Date("2017-02-22T15:18:24.323"),
      bekreftetTidspunkt: null,
      deltakere: [
        {
          hendelser: [],
          deltakerUuid: "uuid1",
          navn: "Are Arbeidsgiver",
          orgnummer: "123456789",
          epost: "are.arbeidsgiver@nav.no",
          type: "arbeidsgiver",
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-03-09T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
        {
          hendelser: [],
          deltakerUuid: "uuid2",
          navn: "Sygve Sykmeldt",
          orgnummer: null,
          epost: null,
          type: "Bruker",
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
            {
              id: 2,
              tid: new Date("2017-03-09T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
      ],
      bekreftetAlternativ: null,
      alternativer: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-02-25T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
    mote
  );
};

export const bareEtAlternativ = () => {
  return Object.assign(
    {},
    {
      status: "OPPRETTET",
      opprettetTidspunkt: new Date("2017-02-22T15:18:24.323"),
      bekreftetTidspunkt: null,
      deltakere: [
        {
          hendelser: [],
          deltakerUuid: "uuid1",
          navn: "Are Arbeidsgiver",
          orgnummer: "123456789",
          epost: "are.arbeidsgiver@nav.no",
          type: "arbeidsgiver",
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
        {
          hendelser: [],
          deltakerUuid: "uuid2",
          navn: "Sygve Sykmeldt",
          orgnummer: null,
          epost: null,
          type: "Bruker",
          svartidspunkt: null,
          svar: [
            {
              id: 1,
              tid: new Date("2017-03-07T15:18:24.323"),
              created: new Date("2017-02-22T15:18:24.323"),
              sted: "Testveien 2",
              valgt: false,
            },
          ],
        },
      ],
      bekreftetAlternativ: null,
      alternativer: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    }
  );
};

export const moteAvbrutt = getMote({ status: "AVBRUTT" });

export const moteBekreftet = getMote({
  status: "BEKREFTET",
  bekreftetTidspunkt: new Date("2017-03-22T09:09:14.33"),
  bekreftetAlternativ: {
    id: 1,
    tid: new Date("2017-03-15T09:09:14.33"),
    created: new Date("2017-03-02T09:09:14.33"),
    sted: "Testveien 2",
    valgt: false,
  },
});

export const moteBekreftetFlereAlternativer = getMote({
  status: "BEKREFTET",
  bekreftetTidspunkt: new Date("2017-02-22T09:09:14.33"),
  bekreftetAlternativ: {
    id: 1,
    tid: new Date("2017-03-15T09:09:14.33"),
    created: new Date("2017-03-02T09:09:14.33"),
    sted: "Testveien 2",
    valgt: false,
  },
});

export const moteBekreftetAvbrutt = getMote({
  status: "AVBRUTT",
  bekreftetTidspunkt: new Date("2017-03-15T09:09:14.33"),
  bekreftetAlternativ: {
    id: 1,
    tid: new Date("2017-03-15T09:09:14.33"),
    created: new Date("2017-03-02T09:09:14.33"),
    sted: "Testveien 2",
    valgt: false,
  },
});

export const moteIkkeBesvart = getMote();

export const moteBesvartAvArbeidsgiver = getMote({
  deltakere: [
    {
      hendelser: [],
      deltakerUuid: "uuid1",
      navn: "Are Arbeidsgiver",
      orgnummer: "981566378",
      epost: "are.arbeidsgiver@nav.no",
      type: "arbeidsgiver",
      svartidspunkt: new Date("2017-03-30T15:18:24.323"),
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-03-09T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
    {
      hendelser: [],
      deltakerUuid: "uuid2",
      navn: "Sygve Sykmeldt",
      orgnummer: null,
      epost: null,
      type: "Bruker",
      svartidspunkt: null,
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-03-09T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
  ],
});

export const moteBesvartTrueAvArbeidsgiver = getMote({
  deltakere: [
    {
      hendelser: [],
      deltakerUuid: "uuid1",
      navn: "Are Arbeidsgiver",
      orgnummer: "981566378",
      epost: "are.arbeidsgiver@nav.no",
      type: "arbeidsgiver",
      svartidspunkt: new Date("2017-03-30T15:18:24.323"),
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 2,
          tid: new Date("2017-03-09T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
    {
      hendelser: [],
      deltakerUuid: "uuid2",
      navn: "Sygve Sykmeldt",
      orgnummer: null,
      epost: null,
      type: "Bruker",
      svartidspunkt: null,
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-07T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-03-09T15:18:24.323"),
          created: new Date("2017-02-22T15:18:24.323"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
  ],
});

export const moteBesvartAlleAlternativer = getMote({
  status: "OPPRETTET",
  fnr: "12345678901",
  opprettetTidspunkt: new Date("2017-02-23T12:57:11.906"),
  bekreftetTidspunkt: null,
  deltakere: [
    {
      hendelser: [],
      deltakerUuid: "uuid1",
      navn: "Are Arbeidsgiver",
      orgnummer: "981566378",
      epost: "are.arbeidsgiver@nav.no",
      type: "arbeidsgiver",
      svartidspunkt: new Date("2017-02-25T12:57:11.906"),
      svar: [
        {
          id: 2,
          tid: new Date("2017-03-10T12:57:11.906"),
          created: new Date("2017-02-23T12:57:11.906"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 1,
          tid: new Date("2017-03-08T12:57:11.906"),
          created: new Date("2017-02-23T12:57:11.906"),
          sted: "Testveien 2",
          valgt: true,
        },
      ],
    },
    {
      hendelser: [],
      deltakerUuid: "uuid2",
      navn: "Sygve Sykmeldt",
      orgnummer: null,
      epost: null,
      type: "Bruker",
      svartidspunkt: new Date("2017-02-26T12:57:11.906"),
      svar: [
        {
          id:
            "random - lagt inn for å sikre at det hentes ut riktig svar basert på ID",
          tid: new Date("2017-03-08T12:57:11.906"),
          created: new Date("2017-02-23T12:57:11.906"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 1,
          tid: new Date("2017-03-08T12:57:11.906"),
          created: new Date("2017-02-23T12:57:11.906"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 2,
          tid: new Date("2017-03-10T12:57:11.906"),
          created: new Date("2017-02-23T12:57:11.906"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
  ],
  bekreftetAlternativ: null,
  alternativer: [
    {
      id: 1,
      tid: new Date("2017-03-08T12:57:11.906"),
      created: new Date("2017-02-23T12:57:11.906"),
      sted: "Testveien 2",
      valgt: true,
    },
    {
      id: 2,
      tid: new Date("2017-03-10T12:57:11.906"),
      created: new Date("2017-02-23T12:57:11.906"),
      sted: "Testveien 2",
      valgt: false,
    },
  ],
});

export const moteBesvartMedNyeAlternativerIkkeBesvart = getMote({
  status: "OPPRETTET",
  fnr: "12345678901",
  opprettetTidspunkt: new Date("2017-02-23T14:04:59.524"),
  bekreftetTidspunkt: null,
  deltakere: [
    {
      hendelser: [],
      deltakerUuid: "uuid1",
      navn: "Are Arbeidsgiver",
      orgnummer: "123456789",
      epost: "are.arbeidsgiver@nav.no",
      type: "arbeidsgiver",
      svartidspunkt: new Date("2017-03-01T14:04:59.524"),
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-08T14:04:59.524"),
          created: new Date("2017-02-23T14:04:59.524"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 2,
          tid: new Date("2017-03-10T14:04:59.524"),
          created: new Date("2017-02-23T14:04:59.524"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 3,
          tid: new Date("2017-03-13T14:04:59.524"),
          created: new Date("2017-02-28T14:04:59.524"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 4,
          tid: new Date("2017-03-14T14:04:59.524"),
          created: new Date("2017-02-28T14:04:59.524"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
    {
      hendelser: [],
      deltakerUuid: "uuid2",
      navn: "Sygve Sykmeldt",
      orgnummer: null,
      epost: null,
      type: "Bruker",
      svartidspunkt: new Date("2017-02-25T14:04:59.524"),
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-08T14:04:59.524"),
          created: new Date("2017-02-23T14:04:59.524"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 2,
          tid: new Date("2017-03-10T14:04:59.524"),
          created: new Date("2017-02-23T14:04:59.524"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 3,
          tid: new Date("2017-03-13T14:04:59.524"),
          created: new Date("2017-02-28T14:04:59.524"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 4,
          tid: new Date("2017-03-14T14:04:59.524"),
          created: new Date("2017-02-28T14:04:59.524"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
  ],
  bekreftetAlternativ: null,
  alternativer: [
    {
      id: 1,
      tid: new Date("2017-03-08T14:04:59.524"),
      created: new Date("2017-02-23T14:04:59.524"),
      sted: "Testveien 2",
      valgt: true,
    },
    {
      id: 2,
      tid: new Date("2017-03-10T14:04:59.524"),
      created: new Date("2017-02-23T14:04:59.524"),
      sted: "Testveien 2",
      valgt: false,
    },
    {
      id: 3,
      tid: new Date("2017-03-13T14:04:59.524"),
      created: new Date("2017-02-28T14:04:59.524"),
      sted: "Testveien 2",
      valgt: false,
    },
    {
      id: 4,
      tid: new Date("2017-03-14T14:04:59.524"),
      created: new Date("2017-02-28T14:04:59.524"),
      sted: "Testveien 2",
      valgt: false,
    },
  ],
});

export const moteBesvartMedNyeAlternativerBesvart = getMote({
  status: "OPPRETTET",
  fnr: "12345678901",
  opprettetTidspunkt: new Date("2017-02-23T13:44:26.41"),
  bekreftetTidspunkt: null,
  deltakere: [
    {
      hendelser: [],
      deltakerUuid: "uuid1",
      navn: "Are Arbeidsgiver",
      orgnummer: "981566378",
      epost: "are.arbeidsgiver@nav.no",
      type: "arbeidsgiver",
      svartidspunkt: new Date("2017-02-25T13:44:26.41"),
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-08T13:44:26.41"),
          created: new Date("2017-02-23T13:44:26.41"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 2,
          tid: new Date("2017-03-10T13:44:26.41"),
          created: new Date("2017-02-23T13:44:26.41"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 3,
          tid: new Date("2017-03-13T13:44:26.41"),
          created: new Date("2017-02-28T13:44:26.41"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 4,
          tid: new Date("2017-03-14T13:44:26.41"),
          created: new Date("2017-02-28T13:44:26.41"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
    {
      hendelser: [],
      deltakerUuid: "uuid2",
      navn: "Sygve Sykmeldt",
      orgnummer: null,
      epost: null,
      type: "Bruker",
      svartidspunkt: new Date("2017-03-01T13:44:26.41"),
      svar: [
        {
          id: 1,
          tid: new Date("2017-03-08T13:44:26.41"),
          created: new Date("2017-02-23T13:44:26.41"),
          sted: "Testveien 2",
          valgt: true,
        },
        {
          id: 2,
          tid: new Date("2017-03-10T13:44:26.41"),
          created: new Date("2017-02-23T13:44:26.41"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 3,
          tid: new Date("2017-03-13T13:44:26.41"),
          created: new Date("2017-02-28T13:44:26.41"),
          sted: "Testveien 2",
          valgt: false,
        },
        {
          id: 4,
          tid: new Date("2017-03-14T13:44:26.41"),
          created: new Date("2017-02-28T13:44:26.41"),
          sted: "Testveien 2",
          valgt: false,
        },
      ],
    },
  ],
  bekreftetAlternativ: null,
  alternativer: [
    {
      id: 1,
      tid: new Date("2017-03-08T13:44:26.41"),
      created: new Date("2017-02-23T13:44:26.41"),
      sted: "Testveien 2",
      valgt: true,
    },
    {
      id: 2,
      tid: new Date("2017-03-10T13:44:26.41"),
      created: new Date("2017-02-23T13:44:26.41"),
      sted: "Testveien 2",
      valgt: false,
    },
    {
      id: 3,
      tid: new Date("2017-03-13T13:44:26.41"),
      created: new Date("2017-02-28T13:44:26.41"),
      sted: "Testveien 2",
      valgt: false,
    },
    {
      id: 4,
      tid: new Date("2017-03-14T13:44:26.41"),
      created: new Date("2017-02-28T13:44:26.41"),
      sted: "Testveien 2",
      valgt: false,
    },
  ],
});
