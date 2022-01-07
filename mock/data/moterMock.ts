import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";

export const moterMock: any[] = [
  {
    id: 2913,
    moteUuid: "e3a641d4-7a4a-4a98-93f1-caae3e432354",
    opprettetAv: VEILEDER_IDENT_DEFAULT,
    aktorId: "1",
    status: "OPPRETTET",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    opprettetTidspunkt: "2019-10-13",
    navEnhet: "0315",
    eier: VEILEDER_IDENT_DEFAULT,
    deltakere: [
      {
        deltakerUuid: "66f1d827-94db-43d4-b6de-2f7902e76bf8",
        navn: "Samuel Jones",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        orgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        epost: "samuel@pontypandyfire.gov.uk",
        type: "Bruker",
        svartidspunkt: "2019-10-14",
        svar: [
          {
            id: 2914,
            tid: "2019-11-10",
            created: "2019-10-13",
            sted: "Hardangervidda",
            valgt: true,
          },
        ],
      },
      {
        deltakerUuid: "198a6dbf-c987-4b57-a401-a3915ec11424",
        navn: "Station Officer Steele",
        fnr: "12345678913",
        orgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        epost: "steele@pontypandyfire.gov.uk",
        type: "arbeidsgiver",
        svartidspunkt: "2019-10-14",
        svar: [
          {
            id: 2914,
            tid: "2019-11-08",
            created: "2019-10-13",
            sted: "Hardangervidda",
            valgt: true,
          },
        ],
      },
    ],
    bekreftetAlternativ: {
      id: 2914,
      tid: "2019-11-08",
      created: "2019-10-13",
      sted: "Hardangervidda",
      valgt: true,
    },
    alternativer: [
      {
        id: 2914,
        tid: "2019-11-08",
        created: "2019-11-13",
        sted: "Hardangervidda",
        valgt: true,
      },
    ],
    sistEndret: "2019-10-14",
    trengerBehandling: true,
  },
];
