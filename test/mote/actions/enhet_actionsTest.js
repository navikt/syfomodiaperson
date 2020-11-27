import { expect } from "chai";
import * as actions from "../../../src/actions/enhet_actions";

describe("enhet_actions", () => {
  it("Har en valgtEnhet()-funksjon som returnerer riktig action", () => {
    const action = actions.valgtEnhet("2212");
    expect(action).to.deep.equal({
      type: "VALGT_ENHET",
      data: "2212",
    });
  });
});
