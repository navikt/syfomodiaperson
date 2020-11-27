import { expect } from "chai";
import * as actions from "../../src/actions/ledere_actions";
import { HENT_LEDERE_FORESPURT } from "../../src/actions/actiontyper";

describe("ledere_actions", () => {
  it("Har en hentLedere()-funksjon", () => {
    const res = actions.hentLedere("44");
    expect(res).to.deep.equal({
      type: HENT_LEDERE_FORESPURT,
      fnr: "44",
    });
  });
});
