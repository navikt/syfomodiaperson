import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import modiacontext from "../../src/data/modiacontext/modiacontext";
import * as actions from "../../src/data/modiacontext/modiacontext_actions";

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("modiacontext", () => {
  it("Håndterer henterAktivEnhet", () => {
    const action = actions.henterAktivEnhet();
    const state = modiacontext({ data: {} }, action);
    expect(state).to.deep.equal({
      henterEnhet: true,
      hentingEnhetFeilet: false,
      data: {},
    });
  });

  it("Håndterer hentAktivEnhetFeilet", () => {
    const action = actions.hentAktivEnhetFeilet();
    const state = modiacontext({ data: {} }, action);
    expect(state).to.deep.equal({
      henterEnhet: false,
      hentingEnhetFeilet: true,
      data: {},
    });
  });

  it("Håndterer henterAktivBruker", () => {
    const action = actions.henterAktivBruker();
    const state = modiacontext({ data: {} }, action);
    expect(state).to.deep.equal({
      henterBruker: true,
      hentingBrukerFeilet: false,
      hentingBrukerForsokt: false,
      data: {},
    });
  });

  it("Håndterer hentAktivBrukerFeilet", () => {
    const action = actions.hentAktivBrukerFeilet();
    const state = modiacontext({ data: {} }, action);
    expect(state).to.deep.equal({
      henterBruker: false,
      hentingBrukerFeilet: true,
      hentingBrukerForsokt: true,
      data: {},
    });
  });
});
