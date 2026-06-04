import { VIRKSOMHET_PONTYPANDY } from "../common/mockConstants";

// Oppfølgingstilfeller i mock:
// Tilfelle 1: 2019-06-06 → 2020-01-21 (Pontypandy)
// Tilfelle 2: 2020-02-21 → 2020-12-10 (Pontypandy)
// Current tilfelle: ~40 uker siden → ~20 uker frem (Pontypandy + BrannOgBil)
export const oppfolgingsplanMock = [
  // Tilfelle 1 (gyldighetstidspunkt innenfor 2019-06-06 → 2020-01-21)
  {
    id: 2956,
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
    sistEndretAvAktoerId: "1902690001002",
    sistEndretDato: "2019-08-15T08:49:05.621",
    status: "AKTIV",
    virksomhet: {
      navn: null,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    },
    godkjentPlan: {
      opprettetTidspunkt: "2019-07-01T08:00:00.000",
      gyldighetstidspunkt: {
        fom: "2019-07-01",
        tom: "2019-11-01",
        evalueres: "2019-09-01",
      },
      tvungenGodkjenning: false,
      deltMedNAVTidspunkt: "2019-07-01T08:00:00.000",
      deltMedNAV: true,
      deltMedFastlegeTidspunkt: null,
      deltMedFastlege: false,
      dokumentUuid: "664fb21f-48c3-4669-82ca-d61f51d20c84",
    },
    oppgaver: [],
    arbeidsgiver: null,
    arbeidstaker: null,
  },
  // Tilfelle 2 (gyldighetstidspunkt innenfor 2020-02-21 → 2020-12-10)
  {
    id: 2957,
    uuid: "2f1e2629-062b-442d-ae1f-3b08e9574cd1",
    sistEndretAvAktoerId: "1902690001002",
    sistEndretDato: "2020-04-01T08:49:05.621",
    status: "AKTIV",
    virksomhet: {
      navn: null,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    },
    godkjentPlan: {
      opprettetTidspunkt: "2020-03-01T08:00:00.000",
      gyldighetstidspunkt: {
        fom: "2020-03-01",
        tom: "2020-09-01",
        evalueres: "2020-06-01",
      },
      tvungenGodkjenning: false,
      deltMedNAVTidspunkt: "2020-03-01T08:00:00.000",
      deltMedNAV: true,
      deltMedFastlegeTidspunkt: null,
      deltMedFastlege: false,
      dokumentUuid: "264fb21f-48c3-4669-82ca-d61f51d20c84",
    },
    oppgaver: [],
    arbeidsgiver: null,
    arbeidstaker: null,
  },
  // Utenfor alle tilfeller (2018 — før tilfelle 1 starter)
  {
    id: 2989,
    uuid: "bc521a51-b75d-49a1-9f67-def017b872fe",
    sistEndretAvAktoerId: "1",
    sistEndretDato: "2018-02-01T08:36:32.186",
    status: "AKTIV",
    virksomhet: {
      navn: null,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    },
    godkjentPlan: {
      opprettetTidspunkt: "2018-01-01T08:00:00.000",
      gyldighetstidspunkt: {
        fom: "2018-01-01",
        tom: "2018-06-01",
        evalueres: "2018-04-01",
      },
      tvungenGodkjenning: false,
      deltMedNAVTidspunkt: "2018-01-01T08:00:00.000",
      deltMedNAV: true,
      deltMedFastlegeTidspunkt: null,
      deltMedFastlege: false,
      dokumentUuid: "49e8256d-ea0b-4828-af2a-079b17ecf367",
    },
    oppgaver: [],
    arbeidsgiver: null,
    arbeidstaker: null,
  },
];
