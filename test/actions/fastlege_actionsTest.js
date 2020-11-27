import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import {
  HENT_FASTLEGER_FORESPURT,
  HENTER_FASTLEGER,
  FASTLEGER_HENTET,
  HENT_FASTLEGER_FEILET,
} from "../../src/actions/actiontyper";
import * as actions from "../../src/actions/fastleger_actions";

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("fastleger_actions", () => {
  it("Skal ha en henterFastleger()-funksjon som returnerer riktig action", () => {
    expect(actions.hentFastleger(1)).to.deep.equal({
      type: HENT_FASTLEGER_FORESPURT,
      fnr: 1,
    });
  });

  it("Skal ha en henterFastleger()-funksjon som returnerer riktig action", () => {
    expect(actions.henterFastleger()).to.deep.equal({
      type: HENTER_FASTLEGER,
    });
  });

  it("har en fastlegerHentet()-funksjon som returnerer riktig action", () => {
    expect(actions.fastlegerHentet(1)).to.deep.equal({
      type: FASTLEGER_HENTET,
      data: 1,
    });
  });

  it("Skal ha en hentFastlegerFeilet()-funksjon som returnerer riktig action", () => {
    expect(actions.hentFastlegerFeilet()).to.deep.equal({
      type: HENT_FASTLEGER_FEILET,
    });
  });
});
