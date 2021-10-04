import { expect } from "chai";
import deepFreeze from "deep-freeze";
import ledere, {
  NarmesteLederRelasjonStatus,
} from "../../src/data/leder/ledere";
import {
  HENTER_LEDERE,
  LEDERE_HENTET,
  HENT_LEDERE_FEILET,
} from "@/data/leder/ledere_actions";

describe("ledere", () => {
  it(`håndterer ${LEDERE_HENTET}`, () => {
    const initialState = deepFreeze({});
    const action = {
      type: LEDERE_HENTET,
      data: [
        {
          narmesteLederNavn: "Kurt Nilsen",
          aktivTom: null,
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
        {
          narmesteLederNavn: "Trine Fransen",
          aktivTom: "2020-04-20T12:00:00+01:00",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
        {
          narmesteLederNavn: "Hans Hansen",
          aktivTom: "2020-02-20T12:00:00+01:00",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
        {
          narmesteLederNavn: "Nina Knutsen",
          aktivTom: null,
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
      ],
    };
    const nextState = ledere(initialState, action);

    expect(nextState).to.deep.equal({
      henter: false,
      hentet: true,
      hentingFeilet: false,
      hentingForsokt: true,
      currentLedere: [
        {
          narmesteLederNavn: "Kurt Nilsen",
          aktivTom: null,
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
        {
          narmesteLederNavn: "Nina Knutsen",
          aktivTom: null,
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
      ],
      formerLedere: [
        {
          narmesteLederNavn: "Trine Fransen",
          aktivTom: "2020-04-20T12:00:00+01:00",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
        {
          narmesteLederNavn: "Hans Hansen",
          aktivTom: "2020-02-20T12:00:00+01:00",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
      ],
      allLedere: [...action.data],
    });
  });

  it(`håndterer ${HENTER_LEDERE}`, () => {
    const initialState = deepFreeze({
      henter: false,
    });
    const action = { type: HENTER_LEDERE };
    const nextState = ledere(initialState, action);
    expect(nextState).to.deep.equal({
      currentLedere: [],
      formerLedere: [],
      allLedere: [],
      henter: true,
      hentet: false,
      hentingFeilet: false,
      hentingForsokt: false,
    });
  });

  it(`håndterer ${HENT_LEDERE_FEILET}`, () => {
    const initialState = deepFreeze({
      henter: false,
    });
    const action = { type: HENT_LEDERE_FEILET };
    const nextState = ledere(initialState, action);
    expect(nextState).to.deep.equal({
      henter: false,
      hentet: false,
      hentingFeilet: true,
      hentingForsokt: true,
      currentLedere: [],
      formerLedere: [],
      allLedere: [],
    });
  });
});
