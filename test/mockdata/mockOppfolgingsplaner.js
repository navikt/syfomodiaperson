import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";

const MILLISECONDS_PER_HOUR = 3600000;
const DAY_IN_MILLISECONDS = MILLISECONDS_PER_HOUR * 24;

const TODAY = new Date();
const TOMORROW = new Date(Date.now() + DAY_IN_MILLISECONDS);
const YESTERDAY = new Date(Date.now() - DAY_IN_MILLISECONDS);
const TWO_DAYS_AGO = new Date(Date.now() - DAY_IN_MILLISECONDS * 2);

export const mockValidActiveOppfolgingsplan = {
  id: 1,
  uuid: "111e2629-062b-442d-ae1f-3b08e9574cd1",
  sistEndretAvAktoerId: "1902690001002",
  sistEndretDato: "2020-01-30T08:49:05.621",
  status: "AKTIV",
  virksomhet: {
    navn: "X-Files",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  },
  godkjentPlan: {
    opprettetTidspunkt: TODAY,
    gyldighetstidspunkt: {
      fom: TODAY,
      tom: TOMORROW,
      evalueres: TOMORROW,
    },
    tvungenGodkjenning: false,
    deltMedNAVTidspunkt: TODAY,
    deltMedNAV: true,
    deltMedFastlegeTidspunkt: null,
    deltMedFastlege: false,
    dokumentUuid: "664fb21f-48c3-4669-82ca-d61f51d20c84",
  },
  oppgaver: [],
  arbeidsgiver: null,
  arbeidstaker: null,
};

export const mockAvbruttActiveOppfolgingsplan = {
  id: 2,
  uuid: "222e2629-062b-442d-ae1f-3b08e9574cd1",
  sistEndretAvAktoerId: "1902690001002",
  sistEndretDato: "2020-01-30T08:49:05.621",
  status: "AVBRUTT",
  virksomhet: {
    navn: "X-Files",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  },
  godkjentPlan: {
    opprettetTidspunkt: YESTERDAY,
    gyldighetstidspunkt: {
      fom: YESTERDAY,
      tom: TOMORROW,
      evalueres: YESTERDAY,
    },
    tvungenGodkjenning: false,
    deltMedNAVTidspunkt: YESTERDAY,
    deltMedNAV: true,
    deltMedFastlegeTidspunkt: null,
    deltMedFastlege: false,
    dokumentUuid: "664fb21f-48c3-4669-82ca-d61f51d20c84",
  },
  oppgaver: [],
  arbeidsgiver: null,
  arbeidstaker: null,
};

export const mockAvbruttInactiveOppfolgingsplan = {
  id: 3,
  uuid: "333e2629-062b-442d-ae1f-3b08e9574cd1",
  sistEndretAvAktoerId: "1902690001002",
  sistEndretDato: "2020-01-30T08:49:05.621",
  status: "AVBRUTT",
  virksomhet: {
    navn: "X-Files",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  },
  godkjentPlan: {
    opprettetTidspunkt: TWO_DAYS_AGO,
    gyldighetstidspunkt: {
      fom: TWO_DAYS_AGO,
      tom: YESTERDAY,
      evalueres: YESTERDAY,
    },
    tvungenGodkjenning: false,
    deltMedNAVTidspunkt: TWO_DAYS_AGO,
    deltMedNAV: true,
    deltMedFastlegeTidspunkt: null,
    deltMedFastlege: false,
    dokumentUuid: "664fb21f-48c3-4669-82ca-d61f51d20c84",
  },
  oppgaver: [],
  arbeidsgiver: null,
  arbeidstaker: null,
};

export const mockValidActiveOppfolgingsplanWithDifferentVirksomhet = {
  ...mockValidActiveOppfolgingsplan,
  virksomhet: {
    navn: "The Syndicate",
    virksomhetsnummer: "987654321",
  },
};
