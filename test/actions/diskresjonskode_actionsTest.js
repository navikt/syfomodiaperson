import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import * as actions from "../../src/actions/diskresjonskode_actions";

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("diskresjonskode_actions", () => {
  it("Skal ha en hentDiskresjonskode()-funksjon som returnerer riktig action", () => {
    expect(actions.hentDiskresjonskode(1)).to.deep.equal({
      type: actions.HENT_DISKRESJONSKODE_FORESPURT,
      fnr: 1,
    });
  });

  it("Skal ha en henterDiskresjonskode()-funksjon som returnerer riktig action", () => {
    expect(actions.henterDiskresjonskode()).to.deep.equal({
      type: actions.HENTER_DISKRESJONSKODE,
    });
  });

  it("har en diskresjonskodeHentet()-funksjon som returnerer riktig action", () => {
    expect(actions.diskresjonskodeHentet(1)).to.deep.equal({
      type: actions.DISKRESJONSKODE_HENTET,
      data: 1,
    });
  });

  it("Skal ha en hentDiskresjonskodeFeilet()-funksjon som returnerer riktig action", () => {
    expect(actions.hentDiskresjonskodeFeilet()).to.deep.equal({
      type: actions.HENT_DISKRESJONSKODE_FEILET,
    });
  });
});
