import { expect } from "chai";
import * as actions from "../../src/actions/navbruker_actions";
import { HENT_NAVBRUKER_FORESPURT } from "../../src/actions/actiontyper";

describe("navbruker_actions", () => {
  it("Har en hentNavbruker()-funksjon", () => {
    const res = actions.hentNavbruker("44");
    expect(res).to.deep.equal({
      type: HENT_NAVBRUKER_FORESPURT,
      fnr: "44",
    });
  });
});
