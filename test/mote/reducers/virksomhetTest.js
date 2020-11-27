import { expect } from "chai";
import deepFreeze from "deep-freeze";
import virksomhet from "../../../src/reducers/virksomhet";
import * as actions from "../../../src/actions/virksomhet_actions";

describe("virksomhet", () => {
  const initState = deepFreeze({});
  let orgnummer;
  beforeEach(() => {
    orgnummer = "8877766";
  });

  it("Har en default state", () => {
    const state = virksomhet();
    expect(state).to.deep.equal({});
  });

  it("Håndterer henterVirksomhet()", () => {
    const action = actions.henterVirksomhet(orgnummer);
    const state = virksomhet(initState, action);
    expect(state).to.deep.equal({
      [orgnummer]: {
        data: {},
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      },
    });
  });

  it("Håndterer virksomhetHentet når det ikke finnes data fra før", () => {
    const data = {
      navn: "NAV Consulting",
    };
    const action = actions.virksomhetHentet(orgnummer, data);
    const currentState = deepFreeze({
      [orgnummer]: {
        data: {},
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      },
    });
    const nextState = virksomhet(currentState, action);
    expect(nextState).to.deep.equal({
      [orgnummer]: {
        data: {
          8877766: "NAV Consulting",
        },
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      },
    });
  });

  it("Håndterer virksomhetHentet når det finnes data fra før", () => {
    const data = {
      navn: "NAV Consulting",
    };
    const action = actions.virksomhetHentet(orgnummer, data);
    const currentState = deepFreeze({
      [orgnummer]: {
        data: {
          123: "BEKK",
        },
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      },
    });
    const nextState = virksomhet(currentState, action);
    expect(nextState).to.deep.equal({
      [orgnummer]: {
        data: {
          8877766: "NAV Consulting",
          123: "BEKK",
        },
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      },
    });
  });

  it("Håndterer hentVirksomhetFeilet", () => {
    const action = actions.hentVirksomhetFeilet(orgnummer);
    const currentState = deepFreeze({
      [orgnummer]: {
        data: {},
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      },
    });
    const nextState = virksomhet(currentState, action);
    expect(nextState).to.deep.equal({
      [orgnummer]: {
        data: {},
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
      },
    });
  });
});
