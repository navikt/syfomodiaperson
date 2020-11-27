import { expect } from "chai";
import deepFreeze from "deep-freeze";
import enhet from "../../../src/reducers/enhet";
import * as actions from "../../../src/actions/enhet_actions";

describe("enhet", () => {
  it("Har en default state", () => {
    const state = enhet();
    expect(state).to.deep.equal({
      valgtEnhet: "",
    });
  });

  it("Håndterer valgtEnhet()", () => {
    const action = actions.valgtEnhet("2212");
    const currentState = deepFreeze({});
    const state = enhet(currentState, action);
    expect(state).to.deep.equal({
      valgtEnhet: "2212",
    });
  });
});
