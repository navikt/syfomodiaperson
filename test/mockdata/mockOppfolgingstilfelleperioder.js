import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";

export const START_DATE_NEWEST_TILFELLE = "2020-04-18";
export const START_DATE_OLDEST_TILFELLE = "2020-03-20";
export const END_DATE_MORE_THAN_16_DAYS_EARLIER = "2020-04-01";
export const END_DATE_16_DAYS_EARLIER = "2020-04-02";
export const TODAY = "2020-04-20";

const NEWEST_VIRKSOMHET = VIRKSOMHET_PONTYPANDY.virksomhetsnummer;
const OLDEST_VIRKSOMHET = "123456789";

const newestPeriode = {
  orgnummer: NEWEST_VIRKSOMHET,
  fom: START_DATE_NEWEST_TILFELLE,
  tom: "2020-04-20",
  grad: 100,
  aktivitet: "Heihei",
};

const olderPeriodeForSameVirksomhet = {
  orgnummer: NEWEST_VIRKSOMHET,
  fom: START_DATE_OLDEST_TILFELLE,
  tom: END_DATE_16_DAYS_EARLIER,
  grad: 100,
  aktivitet: "Heihei",
};

const olderConnectedPeriode = {
  orgnummer: OLDEST_VIRKSOMHET,
  fom: START_DATE_OLDEST_TILFELLE,
  tom: END_DATE_16_DAYS_EARLIER,
  grad: 100,
  aktivitet: "Heihei",
};

const olderUnconnectedPeriode = {
  orgnummer: OLDEST_VIRKSOMHET,
  fom: START_DATE_OLDEST_TILFELLE,
  tom: END_DATE_MORE_THAN_16_DAYS_EARLIER,
  grad: 100,
  aktivitet: "Heihei",
};

export const oppfolgingstilfelleperioderWithOneTilfelle = {
  NEWEST_VIRKSOMHET: {
    data: [newestPeriode],
  },
};

export const oppfolgingstilfelleperioderWithTwoPerioderInOneTilfelle = {
  NEWEST_VIRKSOMHET: {
    data: [newestPeriode, olderPeriodeForSameVirksomhet],
  },
};

export const oppfolgingstilfelleperioderWithTwoConnectedTilfeller = {
  NEWEST_VIRKSOMHET: {
    data: [newestPeriode],
  },
  OLDEST_VIRKSOMHET: {
    data: [olderConnectedPeriode],
  },
};

export const oppfolgingstilfelleperioderWithTwoUnconnectedTilfeller = {
  OLDEST_VIRKSOMHET: {
    data: [olderUnconnectedPeriode],
  },
  NEWEST_VIRKSOMHET: {
    data: [newestPeriode],
  },
};

export const oppfolgingstilfelleperioderOneTilfelleInactive = {
  OLDEST_VIRKSOMHET: {
    data: [olderUnconnectedPeriode],
  },
};

export const oppfolgingstilfelleperioderMoreThanOneTilfelleInactive = {
  OLDEST_VIRKSOMHET: {
    data: [olderUnconnectedPeriode],
  },
  NEWEST_VIRKSOMHET: {
    data: [olderConnectedPeriode],
  },
};

export const customOppfolgingstilfelleperioder = (fom, tom) => {
  return {
    [VIRKSOMHET_PONTYPANDY.virksomhetsnummer]: {
      data: [
        {
          orgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
          fom: fom,
          tom: tom,
          grad: 100,
          aktivitet: "aktivitet",
        },
      ],
    },
  };
};
