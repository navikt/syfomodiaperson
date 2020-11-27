import deepFreeze from "deep-freeze";
import { expect } from "chai";
import soknader from "../../src/reducers/soknader";
import * as actions from "../../src/actions/soknader_actions";
import mockSoknader from "../mockdata/mockSoknader";

describe("soknader", () => {
  it("Håndterer henter", () => {
    const action = actions.henterSoknader();
    const initState = soknader();
    const state = soknader(deepFreeze(initState), action);
    expect(state.henter).to.equal(true);
  });

  it("Håndterer hentSoknaderFeilet", () => {
    const action = actions.hentSoknaderFeilet();
    const initState = soknader();
    const state = soknader(deepFreeze(initState), action);
    expect(state.hentingFeilet).to.equal(true);
    expect(state.henter).to.equal(false);
    expect(state.hentet).to.equal(true);
  });

  it("Håndterer soknaderHentet", () => {
    const initState = soknader();
    const action = actions.soknaderHentet(mockSoknader);
    const state = soknader(deepFreeze(initState), action);
    expect(state.hentingFeilet).to.equal(false);
    expect(state.henter).to.equal(false);
  });
});
