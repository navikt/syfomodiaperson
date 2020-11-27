import { expect } from "chai";
import * as actions from "../../src/actions/motebehov_actions";

describe("moter_actions", () => {
  it("Skal ha en hentMoter()-funksjon som returnerer riktig action", () => {
    const action = actions.hentMotebehov("123");

    expect(action).to.deep.equal({
      type: actions.HENT_MOTEBEHOV_FORESPURT,
      fnr: "123",
    });
  });

  it("Skal ha en henterMotebehov()-funksjon som returnerer riktig action", () => {
    const action = actions.henterMotebehov();

    expect(action).to.deep.equal({
      type: actions.HENT_MOTEBEHOV_HENTER,
    });
  });

  it("Skal ha en motebehovHentet()-funksjon som returnerer riktig action", () => {
    const data = {
      id: 1,
      opprettetAv: "1234",
    };

    const action = actions.motebehovHentet(data);

    expect(action).to.deep.equal({
      type: actions.HENT_MOTEBEHOV_HENTET,
      data: {
        id: 1,
        opprettetAv: "1234",
      },
    });
  });

  it("Skal ha en hentMotebehovFeilet()-funksjon som returnerer riktig action", () => {
    const action = actions.hentMotebehovFeilet();

    expect(action).to.deep.equal({
      type: actions.HENT_MOTEBEHOV_FEILET,
    });
  });
});
